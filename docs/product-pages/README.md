# Pages produit — myrootalia

Contenus (copywriting) et templates Shopify pour les pages produit.

## Pages disponibles

| Produit | Copywriting | Template |
|---|---|---|
| Kit Scalp Activator (phase 1) | [`kit-scalp-activator.md`](./kit-scalp-activator.md) | [`templates/product.kit-scalp-activator.json`](../../templates/product.kit-scalp-activator.json) |

## Comment utiliser un template alternatif dans Shopify

1. **Réimporter le thème** dans Shopify (ou synchroniser via Shopify CLI).
2. Dans l'admin : *Boutique en ligne → Thèmes → Personnaliser*.
3. Le nouveau template apparaît dans le sélecteur *Modèle de produit*.
4. Aller sur la fiche produit **Kit Scalp Activator** → *Options du modèle de thème* → choisir **product.kit-scalp-activator**.
5. Ouvrir la page produit et vérifier l'ordre des sections (doc 20).

## Ordre des sections (doc 20 — CRO)

1. `main-product` — galerie + titre + prix + bouton
2. `icons` — 3 bénéfices
3. `rich-text` — problème
4. `image-with-text` — solution + vidéo démo (à uploader)
5. `icons` — ce qu'il y a dans la boîte
6. `rich-text` (fond vert accent) — sécurité derma roller
7. `reviews` — 3 témoignages (à remplacer par de vrais avis avant lancement)
8. `timeline` — routine 4 semaines
9. `collapsible-content` — FAQ
10. `icons` — garanties finales

## À faire avant de publier

- [ ] Uploader la vidéo démo (20–30 s) dans la section 4.
- [ ] Remplacer les avis placeholder par ≥ 5 vrais témoignages (Judge.me/Loox).
- [ ] Ajouter des photos HD (masseur, roller, carte) dans les sections `icons`.
- [ ] Vérifier le bouton d'achat : label « Commencer ma routine » (dans les settings du bloc `buy_buttons`).
- [ ] Meta title/description remplis (voir `kit-scalp-activator.md` §1).
- [ ] Test mobile et LCP < 2,5 s (doc 22).
