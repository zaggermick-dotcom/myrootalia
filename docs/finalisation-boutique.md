# Ce qu'il reste à faire — myrootalia

État vérifié le 17 août 2026 directement dans ta boutique (produits, collections, menus, livraison, langues, thèmes). Chaque point indique ce que j'ai constaté, pas une liste générique.

Légende : 🔴 bloquant pour vendre · 🟠 avant de lancer la publicité · 🟡 ensuite

---

## 🔴 Bloquants — à régler avant la première vente

### 1. Publier le thème
Ton thème publié est **`myrootalia/main`**, mais tout le travail (page produit, panier, page rituel, nouvelle bannière, 13 sections) est dans **`Copie de myrootalia/main`**, qui reste non publié. Tant que tu ne le publies pas, tes visiteurs voient l'ancienne version.

→ Thèmes → *Copie de myrootalia/main* → **Publier**. (L'API m'interdit cette action, c'est une sécurité.)

### 2. La boutique est configurée en anglais
Langue principale : **`en`**, et c'est la seule publiée. Tout ton contenu est en français : Shopify affichera donc les libellés système (« Add to cart », « Checkout », emails de confirmation) en anglais.

→ Paramètres → Langues → ajouter **Français**, le passer en langue principale, publier.

### 3. Le nom de la boutique est resté « My Store »
Il apparaît dans les emails de confirmation, les factures et l'onglet du navigateur.

→ Paramètres → Détails de la boutique → nom : **myrootalia**.

### 4. Aucune politique légale
Ni confidentialité, ni CGV, ni politique de retour, ni politique d'expédition. C'est **obligatoire au Canada** (Loi sur la protection du consommateur) et exigé par Shopify Payments. Ton pied de page ne les mentionne pas non plus.

→ Paramètres → Politiques : Shopify propose des modèles à adapter. Puis ajoute les liens au menu **Footer** (il n'a que 5 entrées, aucune légale).

Ta politique de retour doit refléter ta promesse : **essai 60 nuits, remboursé sans justification** — c'est plus généreux que le minimum, dis-le explicitement.

### 5. Le poids des variantes est à 0 kg
Les trois variantes de l'huile de Batana ont un poids nul. Si un transporteur calcule les frais au poids, ils seront faux — tu peux vendre à perte sur l'expédition.

→ Produit → chaque variante → Expédition → poids réel (un flacon 30 ml emballé ≈ 0,15 kg ; la cure 3 flacons ≈ 0,45 kg ; 5 flacons ≈ 0,75 kg — à peser vraiment).

### 6. L'upsell du panier pointe vers une collection inexistante
Le tiroir panier est réglé sur la collection **`nos-essentiels`**, qui n'existe pas. Tes collections actuelles : `frontpage` (0 produit), `chute-densite` (1), `pousse-croissance` (1), `cuir-chevelu-sensible` (2), `meilleures-ventes` (1), `routine-complete` (0).

→ Soit tu crées la collection `nos-essentiels`, soit tu pointes l'upsell sur `meilleures-ventes`. Éditeur → icône panier → Upsell.

---

## 🟠 Avant de lancer la publicité

### 7. Aucun référencement produit
Les deux produits n'ont **ni titre SEO ni méta-description**. Google affichera un extrait au hasard.

→ Produit → Référencement → titre ≈ 60 caractères, description ≈ 155. Exemple :
- Titre : *Huile de Batana pure du Honduras | myrootalia*
- Description : *L'huile ancestrale du peuple Miskito, pressée à froid. Nourrit le cuir chevelu, gaine la fibre. Essai 60 nuits, livraison offerte dès 50 $.*

### 8. Stock et références des cures
- Variante **1 flacon** : aucun SKU (les deux autres en ont un).
- Variantes **3 flacons** et **5 flacons** : stock à 0.

La vente reste possible (le suivi d'inventaire est désactivé et la survente autorisée), mais tu ne sauras pas ce qu'il te reste. → Ajoute le SKU manquant et remets du stock, ou masque les cures tant que tu ne les as pas.

### 9. Email de contact personnel
`zaggermick@gmail.com` sert d'email de boutique **et** de contact client. Un client qui répond à une confirmation de commande écrit à ta boîte perso.

→ Crée `contact@myrootelia.com` (ton domaine est déjà en place, avec SSL) et renseigne-le dans Paramètres → Détails de la boutique.

### 10. Images manquantes
La page produit et la page rituel ont des emplacements vides : les **3 étapes de la routine**, les **4 actifs de la formule**, l'**image du problème**, les couvertures **stories** et **UGC**. Le guide `docs/prompts-visuels.md` contient le prompt exact de chacune.

Le **Sérum de Croissance** n'a **aucune image** (0 média) — il est en brouillon, donc ce n'est pas urgent, mais il ne pourra pas être publié sans.

### 11. Aucun avis client
La section `MRT · Avis` est prête et vide, la section témoignages avant/après est masquée. Ces deux sections attendent de **vrais** avis — ne les remplis pas avec des faux, c'est le meilleur moyen de perdre la confiance (et de tomber sous le coup de la publicité trompeuse).

→ Recrute 5 à 10 testeuses, protocole photo dans `docs/prompts-visuels.md` § 1.6.

### 12. Paiements et emails — à vérifier toi-même
Je n'ai pas accès à ces réglages via l'API. À contrôler :
- **Shopify Payments activé** et compte bancaire relié (sinon aucune commande n'aboutit).
- Les **emails de notification** (confirmation, expédition) traduits en français et à ta marque.
- **Une commande test réelle** de bout en bout : ajout au panier → paiement → email reçu.

---

## 🟡 Ensuite

### 13. Faire le ménage dans les thèmes
Tu as **10 thèmes** : `Horizon`, `story-theme-3-2-0`, `t-story-theme-2-8-5-template`, `undefined`, `myrootalia/main`, trois thèmes `claude/…`, `Copie de myrootalia/main`, `Copie mise à jour de Horizon`. C'est confus et ça complique chaque modification.

→ Après publication, supprime tout sauf le thème publié et **une** sauvegarde.

Dans le thème actuel, mes tests de diagnostic ont laissé des fichiers `zz-…` (sections) et `product.t1/t2/t3/t4.json`, `product.s-*.json`, `product.n-*.json` (templates). Ils sont inertes mais encombrent la liste. → Thèmes → ⋯ → Modifier le code, cherche « zz » et « product.t ». (L'API me bloque la suppression de fichiers.)

### 14. Collections vides
`frontpage` et `routine-complete` n'ont aucun produit. Si elles sont affichées quelque part, elles apparaissent vides.

### 15. Contraste du terracotta
Le terracotta `#C25A34` sur fond crème donne un contraste de **4,06:1**, juste sous le seuil d'accessibilité de 4,5:1 pour du texte courant. C'est acceptable pour les icônes, les filets et les gros titres ; pour les petits textes en terracotta (sur-titres en capitales), une teinte légèrement plus foncée comme `#A8482A` monterait à 5,4:1. À voir si tu veux être irréprochable côté accessibilité.

### 16. Mesure d'audience
Rien n'est branché à ma connaissance : pixel Meta, Google Analytics, TikTok. À installer **avant** la publicité, sinon tu paies sans pouvoir mesurer.

---

## Ce qui est fait ✅

- Page produit complète (15 sections, structure CRO du doc 20)
- Page panier et tiroir panier synchronisés, en français, avec modules de conversion
- Page Le Rituel Batana renforcée
- Page d'accueil : bannière premium, reste inchangé
- 13 sections sur mesure, entièrement réglables (plus de 700 réglages au total)
- Bibliothèque de 50 icônes
- Bug « Cannot find variant » corrigé — le produit n'était publié sur aucun canal
- Menu mobile réparé — une condition parasite bloquait son ouverture
- Bloc d'achat réorganisé sur mobile
- Accent terracotta accordé sur toute la boutique
- `scripts/valider-theme.py` : garde-fou contre les rejets silencieux de Shopify
- `docs/prompts-visuels.md` : prompts de tous les visuels

---

## Dans quel ordre attaquer

1. Publier le thème (#1) — sinon rien de ce travail n'est visible.
2. Langue française + nom de boutique (#2, #3) — dix minutes, gros impact.
3. Politiques légales (#4) — obligatoire.
4. Poids des variantes + upsell panier (#5, #6) — évite de perdre de l'argent.
5. Commande test complète (#12).
6. Images (#10) puis SEO (#7).
7. Testeuses et avis (#11) — c'est le plus long, commence tôt.
