# myrootalia

Boutique Shopify et plan de lancement de la marque **myrootalia** — soins naturels, marque-maison évolutive qui démarre par les cheveux (kit + sérum) et s'étend vers le visage et le corps.

> Les documents du plan portent l'ancien nom de travail `RACINE` : c'est la même marque, renommée **myrootalia**.

- **Marchés** : Canada puis USA
- **Cible** : femmes 25–45
- **Modèle** : DTC via Shopify, hero consommable + abonnement

## 📁 Contenu du dépôt

Ce dépôt contient à la fois le **thème Shopify** exporté et l'ensemble du **plan de lancement documenté**.

### Thème Shopify

Export du thème `myrootelia.com` (07 août 2026).

| Dossier | Rôle |
|---|---|
| `layout/` | Templates racines (`theme.liquid`, `password.liquid`) |
| `sections/` | Sections Shopify (header, footer, hero, product, etc.) |
| `blocks/` | Blocs réutilisables (accordion, tabs, badge, testimonial…) |
| `config/` | `settings_data.json`, `settings_schema.json`, `markets.json` |
| `locales/` | Traductions (FR par défaut, EN, DE, ES, IT…) |
| `theme_export__myrootelia-com-undefined__07AUG2026-1045pm.zip` | Archive d'export complète (à réimporter dans Shopify tel quel) |

### Plan de lancement (35 documents)

Voir [`docs/racine/README.md`](./docs/racine/README.md) pour l'index complet.

Chaque document existe en **PDF source** (`docs/racine/RACINE_XX_*.pdf`) et en **version texte** (`docs/racine/txt/RACINE_XX_*.txt`), pour que Git puisse indexer et rechercher dans le contenu.

Grands blocs :

1. **Stratégie & business** (01–07) — modèle, roadmap, marché, concurrence, avatars.
2. **Marque & identité** (08–12) — nom, charte, ton, packaging, infra.
3. **Produit, sourcing & opérations** (13–18) — sérum, kit, Alibaba, QC, prix, stocks.
4. **Boutique Shopify & CRO** (19–23) — setup, page produit, structure, vitesse, avis.
5. **Logistique & SAV** (24–26) — expédition, 3PL, retours.
6. **Acquisition & marketing** (27–32) — Google, Meta, TikTok, UGC, influence, email.
7. **Juridique & finance** (33–35) — enregistrement, conformité, plan financier.

## 🌿 Identité de marque (résumé)

| Rôle | Couleur | Usage |
|---|---|---|
| Principale | Vert forêt profond | Naturel, confiance |
| Accent | Or / ambre doux | Premium chaleureux |
| Neutres | Crème, beige, vert pâle | Fonds, textes |

- **Titres** : serif élégante (Playfair, Cormorant, Fraunces, Bodoni Moda).
- **Textes** : sans-serif lisible (Inter, Poppins, Work Sans).
- **Ton** : naturel, honnête, pédagogue, chaleureux, premium accessible.
- **Messages-clés** : « Repars de la racine avec myrootalia. » — « 2 minutes par jour, de vrais ingrédients. »

⚠️ **Zéro allégation médicale.** « Favorise l'apparence de cheveux plus denses », jamais « fait repousser ». Voir doc 34.

## 🚀 Utiliser le thème Shopify

Deux options.

**Option A — Réimporter l'archive dans Shopify**
1. Admin Shopify → *Boutique en ligne → Thèmes*.
2. *Ajouter un thème → Téléverser un fichier zip*.
3. Sélectionner `theme_export__myrootelia-com-undefined__07AUG2026-1045pm.zip`.

**Option B — Travailler en local avec Shopify CLI**
```bash
# Installation (une fois)
npm install -g @shopify/cli @shopify/theme

# À la racine du dépôt
shopify theme dev --store <votre-boutique>.myshopify.com
# Preview live avec hot reload

# Pousser vers un thème
shopify theme push --unpublished
```

Documentation Shopify CLI : https://shopify.dev/docs/themes/tools/cli

## 🤝 Contribuer

Voir [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## 👤 Auteur

- **zaggermick-dotcom** — [GitHub](https://github.com/zaggermick-dotcom)

## 📞 Support

Ouvrir une [issue](https://github.com/zaggermick-dotcom/myrootalia/issues).
