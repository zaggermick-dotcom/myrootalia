#!/usr/bin/env python3
"""Valide nos sections et templates avant de les envoyer à Shopify.

Contexte : quand le schéma d'une section enfreint une contrainte de curseur,
Shopify rejette le fichier *silencieusement* — la mutation `themeFilesUpsert`
répond « aucune erreur » mais le fichier n'arrive jamais dans le thème. Ce
script rattrape ces cas avant l'envoi.

Règles vérifiées (constatées par bissection sur la boutique) :

  1. curseur (range) : (max - min) doit être un multiple entier du pas
  2. curseur : au moins 2 crans, au plus 101
  3. curseur : la valeur par défaut du schéma doit tomber sur un pas
  4. curseur : les valeurs posées dans un template aussi
  5. url : une ancre seule (« #ancre ») est refusée — laisser le champ vide
     et gérer le repli côté Liquid (`{{ st.lien | default: '#ancre' }}`)
  6. template : réglages, types de blocs et valeurs de select conformes

Par défaut seuls nos fichiers (préfixe `mrt-`) et les templates qui les
utilisent sont contrôlés : les sections livrées avec le thème ont leurs
propres conventions et sont déjà acceptées par Shopify.

Usage :
    python3 scripts/valider-theme.py            # nos fichiers
    python3 scripts/valider-theme.py --tout     # y compris le thème d'origine
"""

import glob
import json
import os
import re
import sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EPS = 1e-9


def hors_pas(valeur, mini, pas):
    """Vrai si `valeur` ne tombe pas sur un cran, en tolérant les flottants."""
    crans = (valeur - mini) / pas
    return abs(crans - round(crans)) > 1e-6


def lire_schema(chemin):
    source = open(chemin, encoding="utf-8").read()
    trouve = re.search(r"{%\s*schema\s*%}(.*?){%\s*endschema\s*%}", source, re.S)
    return json.loads(trouve.group(1)) if trouve else None


def verifier_reglages(reglages, ou, fichier, erreurs):
    for r in reglages:
        if r.get("type") != "range":
            continue
        rid, mini, maxi, pas = r.get("id"), r["min"], r["max"], r["step"]
        crans = (maxi - mini) / pas
        if abs(crans - round(crans)) > 1e-6:
            erreurs.append(
                f"{fichier} · {ou}.{rid} : amplitude {maxi}-{mini} non divisible par le pas {pas}"
            )
        if crans < 2 - EPS or crans > 101 + EPS:
            erreurs.append(f"{fichier} · {ou}.{rid} : {crans:g} crans (2 à 101 requis)")
        defaut = r.get("default")
        if defaut is None or not mini - EPS <= defaut <= maxi + EPS or hors_pas(defaut, mini, pas):
            erreurs.append(f"{fichier} · {ou}.{rid} : valeur par défaut {defaut} hors des pas")


def contraintes(reglages):
    return {
        "valides": {r["id"] for r in reglages if "id" in r},
        "range": {r["id"]: (r["min"], r["max"], r["step"]) for r in reglages if r.get("type") == "range"},
        "select": {
            r["id"]: {str(o["value"]) for o in r.get("options", [])}
            for r in reglages if r.get("type") == "select"
        },
        "url": {r["id"] for r in reglages if r.get("type") == "url"},
    }


def verifier_valeurs(valeurs, c, prefixe, erreurs):
    for k, v in valeurs.items():
        if k not in c["valides"]:
            erreurs.append(f"{prefixe} : réglage inconnu « {k} »")
        elif k in c["range"] and isinstance(v, (int, float)):
            mini, maxi, pas = c["range"][k]
            if not mini - EPS <= v <= maxi + EPS or hors_pas(v, mini, pas):
                erreurs.append(f"{prefixe}.{k} = {v} hors des pas (min {mini}, pas {pas})")
        elif k in c["select"] and str(v) not in c["select"][k]:
            erreurs.append(f"{prefixe}.{k} = « {v} » absent des options")
        elif k in c["url"] and str(v).startswith("#"):
            erreurs.append(f"{prefixe}.{k} : ancre « {v} » refusée dans un champ url (laisser vide)")


def main():
    os.chdir(RACINE)
    tout = "--tout" in sys.argv
    motif = "sections/*.liquid" if tout else "sections/mrt-*.liquid"
    erreurs = []
    schemas = {}

    for chemin in sorted(glob.glob(motif)):
        nom = os.path.basename(chemin)[:-7]
        try:
            schema = lire_schema(chemin)
        except json.JSONDecodeError as exc:
            erreurs.append(f"{nom} : JSON du schéma invalide — {exc}")
            continue
        if schema is None:
            continue
        schemas[nom] = schema
        verifier_reglages(schema.get("settings", []), "section", nom, erreurs)
        types_blocs = {b["type"] for b in schema.get("blocks", [])}
        for bloc in schema.get("blocks", []):
            verifier_reglages(bloc.get("settings", []), f"bloc:{bloc['type']}", nom, erreurs)
        for preset in schema.get("presets", []):
            for pb in preset.get("blocks", []):
                if pb["type"] not in types_blocs:
                    erreurs.append(f"{nom} : préréglage avec bloc inconnu « {pb['type']} »")

    templates = sorted(glob.glob("templates/*.json"))
    for chemin in templates:
        nom = os.path.basename(chemin)
        brut = re.sub(r"^/\*.*?\*/\s*", "", open(chemin, encoding="utf-8").read(), flags=re.S)
        try:
            contenu = json.loads(brut)
        except json.JSONDecodeError as exc:
            erreurs.append(f"{nom} : JSON invalide — {exc}")
            continue
        for cle, section in contenu.get("sections", {}).items():
            schema = schemas.get(section["type"])
            if schema is None:
                continue
            verifier_valeurs(section.get("settings", {}), contraintes(schema.get("settings", [])),
                             f"{nom} · {cle}", erreurs)
            par_bloc = {b["type"]: contraintes(b.get("settings", [])) for b in schema.get("blocks", [])}
            for bid in section.get("block_order", []):
                bloc = section["blocks"][bid]
                if bloc["type"] not in par_bloc:
                    erreurs.append(f"{nom} · {cle} : type de bloc inconnu « {bloc['type']} »")
                    continue
                verifier_valeurs(bloc.get("settings", {}), par_bloc[bloc["type"]],
                                 f"{nom} · {cle}/{bid}", erreurs)
        if set(contenu.get("order", [])) != set(contenu.get("sections", {})):
            erreurs.append(f"{nom} : « order » ne correspond pas à la liste des sections")

    print(f"{len(schemas)} section(s) et {len(templates)} template(s) vérifiés.")
    if erreurs:
        print(f"\n{len(erreurs)} problème(s) :")
        for e in erreurs:
            print("  ✗", e)
        return 1
    print("✅ Tout est conforme.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
