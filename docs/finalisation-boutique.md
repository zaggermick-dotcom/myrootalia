# Ce qu'il reste à faire — myrootalia

État vérifié le 17 août 2026 directement dans ta boutique (thèmes, produits, collections, politiques, langues, panier). Chaque point indique ce que j'ai constaté, pas une liste générique.

Légende : 🔴 bloquant pour vendre · 🟠 avant de lancer la publicité · 🟡 ensuite

---

## 🔴 Bloquants — à régler avant la première vente

### 1. La boutique est configurée en anglais
Langue principale : **`en`**, et c'est la seule publiée. Tout ton contenu est en français : Shopify affiche donc les libellés système (« Add to cart », « Checkout »), les emails de confirmation et la politique de confidentialité en anglais.

→ Paramètres → Langues → ajouter **Français**, le passer en langue principale, publier.

### 2. Le nom de la boutique est resté « My Store »
Il apparaît dans les emails de confirmation, les factures et l'onglet du navigateur.

→ Paramètres → Détails de la boutique → nom : **myrootalia**.

### 3. Politiques légales incomplètes
Seule la **politique de confidentialité** existe — et c'est le modèle **anglais** généré automatiquement par Shopify. Il manque : remboursement, expédition, conditions générales de vente. C'est **obligatoire au Canada** (Loi sur la protection du consommateur) et exigé par Shopify Payments. Ton pied de page ne mentionne aucune politique.

→ **Les quatre textes sont écrits, en français, prêts à coller : [`docs/politiques-legales.md`](politiques-legales.md).** Shopify m'interdit de les publier via l'API (scope `write_legal_policies` refusé), c'est un copier-coller de cinq minutes dans Paramètres → Politiques.

La politique de remboursement reflète ta promesse : **essai 60 nuits, remboursé sans justification, flacon entamé accepté**. Relis les trois clauses signalées en tête du document — ce sont des choix commerciaux, pas des standards.

### 4. Deux réglages du panier à corriger dans l'éditeur
Je les ai corrigés dans le dépôt Git, mais **Shopify bloque l'écriture de fichiers sur le thème publié** (voir point 13) : il faut les refaire à la main, c'est deux clics.

| Où | Réglage | Valeur actuelle | À mettre |
|---|---|---|---|
| Éditeur → icône **Panier** (le tiroir) | *Activer l'upsell* | coché, pointant vers la collection `nos-essentiels` **qui n'existe pas** | **décoché** |
| Éditeur → ⚙️ **Paramètres du thème** → **Panier** | *URL dans le panier vide* | `collections/nos-essentiels-copie`, **inexistante** → bouton mort | `collections/meilleures-ventes` |

Pourquoi désactiver l'upsell plutôt que le rebrancher : tu n'as **qu'un seul produit actif**. Un upsell le proposerait dans le panier de quelqu'un qui vient de l'ajouter. Le jour où le Sérum de Croissance est publié, ajoute-le à la collection **Routine complète** (elle est déjà sélectionnée, vide) et recoche la case — rien d'autre à faire.

---

## 🟠 Avant de lancer la publicité

### 5. Stock des cures
Variantes **3 flacons** et **5 flacons** : quantité à 0. La vente n'est **pas** bloquée — le suivi d'inventaire est désactivé et la survente autorisée — mais tu ne sauras jamais ce qu'il te reste.

→ Active le suivi d'inventaire et saisis les quantités réelles, ou masque les cures tant que tu ne les tiens pas en stock.

### 6. Email de contact personnel
`zaggermick@gmail.com` sert d'email de boutique **et** de contact client. Un client qui répond à une confirmation de commande écrit à ta boîte perso — et c'est cette adresse qui s'affiche dans les politiques.

→ Crée `contact@myrootelia.com` (ton domaine est en place, avec SSL) et renseigne-le dans Paramètres → Détails de la boutique.

### 7. Images manquantes
La page produit et la page rituel ont des emplacements vides : les **3 étapes de la routine**, les **4 actifs de la formule**, l'**image du problème**, les couvertures **stories** et **UGC**. Le guide [`docs/prompts-visuels.md`](prompts-visuels.md) contient le prompt exact de chacune.

Le **Sérum de Croissance** n'a **aucune image** (0 média) — il est en brouillon, donc ce n'est pas urgent, mais il ne pourra pas être publié sans.

### 8. Aucun avis client
La section `MRT · Avis` est prête et vide, la section témoignages avant/après est masquée. Ces deux sections attendent de **vrais** avis — ne les remplis pas avec des faux, c'est le meilleur moyen de perdre la confiance (et de tomber sous le coup de la publicité trompeuse).

→ Recrute 5 à 10 testeuses, protocole photo dans `docs/prompts-visuels.md` § 1.6.

### 9. Paiements et emails — à vérifier toi-même
Je n'ai pas accès à ces réglages via l'API. À contrôler :
- **Shopify Payments activé** et compte bancaire relié (sinon aucune commande n'aboutit).
- Les **emails de notification** (confirmation, expédition) traduits en français et à ta marque.
- **Une commande test réelle** de bout en bout : ajout au panier → paiement → email reçu.

### 10. Peser réellement les produits
J'ai renseigné des poids estimés (0,18 / 0,52 / 0,82 kg). Ce sont des **estimations**, pas des mesures. Si un transporteur facture au poids, un écart se paie sur chaque commande.

→ Pèse un colis prêt à partir de chaque format et corrige : Produit → variante → Expédition → Poids.

---

## 🟡 Ensuite

### 11. Faire le ménage dans les thèmes
Tu as **10 thèmes** : `Horizon`, `story-theme-3-2-0`, `t-story-theme-2-8-5-template`, `undefined`, `myrootalia/main`, deux thèmes `myrootalia/claude/…`, `Copie de myrootalia/main` (publié), `Copie mise à jour de Horizon`. C'est confus et ça complique chaque modification.

→ Supprime tout sauf le thème publié et **une** sauvegarde.

Dans le thème publié, mes tests de diagnostic ont laissé des fichiers `zz-…` (sections) et `product.t1/t2/t3/t4.json`, `product.s-*.json`, `product.n-*.json` (templates). Ils sont inertes mais encombrent la liste. → Thèmes → ⋯ → Modifier le code, cherche « zz » et « product.t ». (L'API me bloque la suppression de fichiers.)

### 12. Collections vides
`frontpage` (Home page) et `routine-complete` n'ont aucun produit. Si elles sont affichées quelque part, elles apparaissent vides. `routine-complete` est celle qui alimentera l'upsell du panier (point 4).

### 13. Le thème publié n'est plus relié à GitHub — à savoir pour la suite
Le thème en ligne est **`Copie de myrootalia/main`**. C'est une copie manuelle : elle n'est **pas** synchronisée avec le dépôt GitHub (contrairement à `myrootalia/main` et aux thèmes `myrootalia/claude/…`, qui suivent des branches).

Deux conséquences :
- Un `git push` ne met **plus** la boutique à jour.
- Shopify m'interdit d'écrire dans un thème publié. Toute modification de code doit désormais passer par : **Thèmes → ⋯ → Dupliquer** le thème publié → je travaille sur la copie (non publiée) → tu publies.

Dis-le-moi au début de la prochaine session : je travaillerai directement sur la bonne copie.

### 14. Contraste du terracotta
Le terracotta `#C25A34` sur fond crème donne un contraste de **4,06:1**, juste sous le seuil d'accessibilité de 4,5:1 pour du texte courant. C'est acceptable pour les icônes, les filets et les gros titres ; pour les petits textes en terracotta (sur-titres en capitales), une teinte légèrement plus foncée comme `#A8482A` monterait à 5,4:1. À voir si tu veux être irréprochable côté accessibilité.

### 15. Mesure d'audience
Rien n'est branché à ma connaissance : pixel Meta, Google Analytics, TikTok. À installer **avant** la publicité, sinon tu paies sans pouvoir mesurer.

---

## Ce qui est fait ✅

**Boutique**
- Thème publié — le travail est en ligne
- Bug « Cannot find variant » corrigé — le produit n'était publié sur aucun canal de vente
- Poids des variantes renseignés (0,18 / 0,52 / 0,82 kg — à confirmer à la pesée, point 10)
- SKU manquant ajouté : `MYR-BATANA-1`, `MYR-BATANA-3`, `MYR-BATANA-5`
- Référencement des deux produits : titre SEO + méta-description rédigés

**Thème**
- Page produit complète (15 sections, structure CRO du doc 20)
- Page panier et tiroir panier synchronisés, en français, avec modules de conversion
- Page Le Rituel Batana renforcée
- Page d'accueil : bannière premium, reste inchangé
- 13 sections sur mesure, entièrement réglables (plus de 700 réglages au total)
- Bibliothèque de 50 icônes
- Menu mobile réparé — une condition parasite bloquait son ouverture
- Bloc d'achat réorganisé sur mobile
- Accent terracotta accordé sur toute la boutique

**Documents**
- `docs/politiques-legales.md` : les 4 politiques rédigées, prêtes à coller
- `docs/prompts-visuels.md` : prompts de tous les visuels
- `scripts/valider-theme.py` : garde-fou contre les rejets silencieux de Shopify

---

## Dans quel ordre attaquer

1. **Langue française + nom de boutique** (#1, #2) — dix minutes, gros impact.
2. **Politiques légales** (#3) — obligatoire, les textes sont écrits.
3. **Les deux réglages du panier** (#4) — deux clics, évite un bouton mort.
4. **Commande test complète** (#9).
5. **Images** (#7) puis **pesée réelle** (#10).
6. **Testeuses et avis** (#8) — c'est le plus long, commence tôt.
