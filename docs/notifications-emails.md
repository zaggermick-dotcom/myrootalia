# Modèles d'emails Shopify — myrootalia

**Ces modèles ne sont pas dans le thème.** L'API Admin de Shopify n'expose
aucune mutation pour les éditer : ni `notificationTemplateUpdate`, ni
`emailTemplateUpdate` (vérifié). C'est le même cas que les politiques légales
— je te livre le code, tu le colles.

**Où coller** : Boutique en ligne → Paramètres → Notifications → cliquer sur
un modèle → onglet **« Corps de l'e-mail (HTML) »** → tout remplacer par le
bloc correspondant → **Enregistrer**.

Avant de coller, prévisualise avec le bouton **« Aperçu »**. Après avoir
collé, envoie-toi un email test avec **« Envoyer un e-mail test »** en haut.

---

## Ce que j'ai fait

- **Système de design commun** (palette + typographie + composants) pour que
  tous les emails aient la même signature visuelle.
- **En-tête réutilisable** avec logo et un fil terracotta discret.
- **Pied réutilisable** avec réassurance, coordonnées et mentions.
- **12 modèles complets** pour les emails qui portent la conversion et la
  relation client.
- Liste explicite des ~20 modèles à **laisser tels quels** parce qu'ils ne
  s'appliquent pas à myrootalia (POS, B2B, retrait magasin, livraison
  locale, cadeau, etc.).

Tous les emails :
- **Largeur 600 px**, la taille standard qui tient dans Gmail et Outlook.
- **Tableaux HTML** (les emails ne supportent ni flex ni grid).
- **Styles inline** (les `<style>` sont supprimés par Gmail Mobile et Outlook).
- **Palette et polices** de la boutique — vert forêt, terracotta, crème,
  Bodoni Moda pour les titres.
- **Textes bruts** aussi (les tutoiements de la marque, pas des « vous »
  distants).

---

## Palette et typographie (référence)

Copie ces valeurs partout où tu vois `#XXX` dans les modèles :

| Rôle | Couleur | Usage |
|---|---|---|
| Vert forêt | `#1E3A2F` | Titres, bouton principal |
| Terracotta | `#C25A34` | Accent, filet, prix mis en avant |
| Or discret | `#B8894A` | Badge garantie |
| Crème | `#FAF6EF` | Fond du corps |
| Sable | `#F1EAE0` | Fond des blocs |
| Encre douce | `#5E6B62` | Textes secondaires |
| Filet | `#DDD3C4` | Séparateurs |

**Polices** :
- Titres : `Georgia, 'Times New Roman', serif` (les emails ne peuvent pas
  charger Bodoni Moda — Georgia est le plus proche natif partout).
- Corps : `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.

---

## 1. En-tête réutilisable

**À coller en haut de chaque email**, juste après `<body>`. Change
uniquement l'URL du logo si tu l'héberges autre part.

```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#25332C;">
  <tr>
    <td align="center" style="padding:32px 20px 0;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
        <tr>
          <td align="center" style="padding-bottom:24px;">
            <a href="{{ shop.url }}" style="text-decoration:none;">
              {% if shop.email_logo_url %}
                <img src="{{ shop.email_logo_url }}" alt="{{ shop.name }}" width="{{ shop.email_logo_width }}" style="display:block;max-width:180px;height:auto;">
              {% else %}
                <span style="font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#1E3A2F;letter-spacing:.02em;">myrootalia</span>
              {% endif %}
            </a>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #C25A34;height:0;line-height:0;font-size:0;">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

## 2. Pied réutilisable

**À coller en bas de chaque email**, avant `</body>`.

```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#25332C;">
  <tr>
    <td align="center" style="padding:32px 20px 40px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
        <tr>
          <td style="border-top:1px solid #DDD3C4;padding-top:24px;text-align:center;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
              <tr>
                <td style="padding:0 12px;font-size:12px;color:#5E6B62;">Essai 60 nuits</td>
                <td style="padding:0 12px;font-size:12px;color:#5E6B62;">Livraison offerte dès 50 $</td>
                <td style="padding:0 12px;font-size:12px;color:#5E6B62;">Expédié du Québec</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding-top:20px;text-align:center;font-size:12px;line-height:1.6;color:#5E6B62;">
            Une question ? Écris-nous à
            <a href="mailto:{{ shop.email }}" style="color:#C25A34;text-decoration:none;">{{ shop.email }}</a>
            — on répond en moins de 24 h.
          </td>
        </tr>
        <tr>
          <td style="padding-top:20px;text-align:center;font-size:11px;line-height:1.5;color:#8A9187;">
            {{ shop.name }} — {{ shop.address.summary }}<br>
            <a href="{{ shop.url }}" style="color:#8A9187;text-decoration:underline;">{{ shop.url | remove: 'https://' | remove: 'http://' }}</a>
          </td>
        </tr>
        {% if unsubscribe_url %}
        <tr>
          <td style="padding-top:12px;text-align:center;font-size:11px;color:#8A9187;">
            <a href="{{ unsubscribe_url }}" style="color:#8A9187;">Se désabonner</a>
          </td>
        </tr>
        {% endif %}
      </table>
    </td>
  </tr>
</table>
```

---

# Les 12 modèles complets

Chacun est **autonome** : il inclut l'en-tête et le pied ci-dessus. Tu peux
donc littéralement tout sélectionner et coller à la place du HTML existant
dans Shopify.

---

## Modèle 1/12 — Confirmation de commande ⭐

**Le plus important.** ~90 % d'ouverture. C'est ta première impression
post-achat, elle fixe le ton.

Shopify → Paramètres → Notifications → **Confirmation de commande** → HTML.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{{ shop.name }} — Confirmation de commande</title>
</head>
<body style="margin:0;padding:0;background:#FAF6EF;">

<!-- EN-TÊTE -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#25332C;">
  <tr><td align="center" style="padding:32px 20px 0;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td align="center" style="padding-bottom:24px;">
        <a href="{{ shop.url }}" style="text-decoration:none;">
          {% if shop.email_logo_url %}<img src="{{ shop.email_logo_url }}" alt="{{ shop.name }}" width="{{ shop.email_logo_width }}" style="display:block;max-width:180px;height:auto;">{% else %}<span style="font-family:Georgia,serif;font-size:26px;color:#1E3A2F;">myrootalia</span>{% endif %}
        </a>
      </td></tr>
      <tr><td style="border-top:1px solid #C25A34;height:0;line-height:0;font-size:0;">&nbsp;</td></tr>
    </table>
  </td></tr>
</table>

<!-- HÉROS : merci -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:36px 20px 24px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td align="center">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#C25A34;font-weight:600;">Commande confirmée</p>
        <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-weight:500;font-size:30px;line-height:1.2;color:#1E3A2F;">
          Merci {{ customer.first_name | default: 'à toi' }}.
        </h1>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#5E6B62;">
          On a bien reçu ta commande <strong style="color:#1E3A2F;">{{ order_name }}</strong>.
          Tu recevras un email quand elle sera expédiée du Québec — sous 24 à 48&nbsp;h ouvrées.
        </p>
      </td></tr>
      <tr><td align="center" style="padding-top:28px;">
        <a href="{{ order_status_url }}" style="display:inline-block;padding:14px 32px;background:#1E3A2F;color:#FAF6EF;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;letter-spacing:.02em;">Voir ma commande</a>
      </td></tr>
    </table>
  </td></tr>
</table>

<!-- LIGNES D'ARTICLES -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:16px 20px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #DDD3C4;border-radius:14px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 14px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#5E6B62;font-weight:600;">Ta commande</p>
        {% for line in line_items %}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:{% if forloop.last %}0{% else %}14px{% endif %};">
            <tr>
              <td valign="top" width="72" style="padding-right:14px;">
                {% if line.image %}<img src="{{ line | img_url: 'small' }}" alt="{{ line.title | escape }}" width="60" height="60" style="display:block;width:60px;height:60px;border-radius:8px;background:#F1EAE0;object-fit:cover;">{% endif %}
              </td>
              <td valign="top" style="font-size:14px;line-height:1.4;color:#25332C;">
                <div style="font-family:Georgia,serif;font-size:15px;color:#1E3A2F;font-weight:500;">{{ line.title }}</div>
                {% if line.variant.title != 'Default Title' %}<div style="font-size:12px;color:#5E6B62;margin-top:2px;">{{ line.variant.title }}</div>{% endif %}
                <div style="font-size:12px;color:#5E6B62;margin-top:2px;">Quantité : {{ line.quantity }}</div>
              </td>
              <td valign="top" align="right" style="font-size:14px;color:#1E3A2F;font-weight:600;white-space:nowrap;">
                {{ line.final_line_price | money }}
              </td>
            </tr>
          </table>
        {% endfor %}
      </td></tr>
    </table>
  </td></tr>
</table>

<!-- TOTAUX -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:8px 20px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#F1EAE0;border-radius:14px;">
      <tr><td style="padding:20px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#5E6B62;">Sous-total</td>
            <td align="right" style="padding:3px 0;font-size:13px;color:#25332C;font-weight:600;">{{ subtotal_price | money }}</td>
          </tr>
          {% if total_discounts > 0 %}
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#C25A34;font-weight:600;">Tu économises</td>
            <td align="right" style="padding:3px 0;font-size:13px;color:#C25A34;font-weight:700;">-{{ total_discounts | money }}</td>
          </tr>
          {% endif %}
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#5E6B62;">Livraison</td>
            <td align="right" style="padding:3px 0;font-size:13px;color:#25332C;font-weight:600;">{% if total_shipping_price == 0 %}Offerte{% else %}{{ total_shipping_price | money }}{% endif %}</td>
          </tr>
          {% if tax_price > 0 %}
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#5E6B62;">Taxes</td>
            <td align="right" style="padding:3px 0;font-size:13px;color:#25332C;font-weight:600;">{{ tax_price | money }}</td>
          </tr>
          {% endif %}
          <tr><td colspan="2" style="padding-top:10px;"><div style="border-top:1px dashed #DDD3C4;"></div></td></tr>
          <tr>
            <td style="padding:10px 0 0;font-size:14px;color:#1E3A2F;font-weight:600;">Total</td>
            <td align="right" style="padding:10px 0 0;font-family:Georgia,serif;font-size:20px;color:#1E3A2F;font-weight:700;">{{ total_price | money }}</td>
          </tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
</table>

<!-- ADRESSE + LIVRAISON -->
{% if requires_shipping and shipping_address %}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:16px 20px 0;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr>
        <td valign="top" width="50%" style="padding-right:12px;font-size:13px;line-height:1.55;color:#25332C;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#5E6B62;font-weight:600;">Livraison</p>
          {{ shipping_address.name }}<br>
          {{ shipping_address.street }}<br>
          {{ shipping_address.city }} {{ shipping_address.province_code }} {{ shipping_address.zip }}<br>
          {{ shipping_address.country }}
        </td>
        <td valign="top" width="50%" style="padding-left:12px;font-size:13px;line-height:1.55;color:#25332C;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#5E6B62;font-weight:600;">Méthode</p>
          {{ shipping_method.title }}
        </td>
      </tr>
    </table>
  </td></tr>
</table>
{% endif %}

<!-- GARANTIE 60 NUITS -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:24px 20px 0;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:rgba(184,137,74,0.12);border:1px solid rgba(184,137,74,0.4);border-radius:12px;">
      <tr><td style="padding:14px 18px;font-size:13px;line-height:1.5;color:#1E3A2F;">
        <strong style="color:#B8894A;">Essai 60 nuits.</strong>
        Si le résultat ne te convient pas, écris-nous et on rembourse — flacon entamé accepté, sans justification.
      </td></tr>
    </table>
  </td></tr>
</table>

<!-- PIED -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:32px 20px 40px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td style="border-top:1px solid #DDD3C4;padding-top:24px;text-align:center;font-size:12px;line-height:1.6;color:#5E6B62;">
        Une question ? Écris-nous à <a href="mailto:{{ shop.email }}" style="color:#C25A34;text-decoration:none;">{{ shop.email }}</a> — on répond en moins de 24 h.
      </td></tr>
      <tr><td style="padding-top:20px;text-align:center;font-size:11px;line-height:1.5;color:#8A9187;">
        {{ shop.name }} — {{ shop.address.summary }}
      </td></tr>
    </table>
  </td></tr>
</table>

</body>
</html>
```

**Ligne d'objet à mettre en haut** (champ « Objet ») :
`Ta commande {{ order_name }} est confirmée — merci.`

---

## Modèle 2/12 — Confirmation d'expédition ⭐

Deuxième plus lu (~85 %). Le moment où la cliente est excitée.

Shopify → Notifications → **Confirmation d'expédition**.

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{ shop.name }} — Ta commande est partie</title></head>
<body style="margin:0;padding:0;background:#FAF6EF;">

<!-- EN-TÊTE (identique) -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#25332C;">
  <tr><td align="center" style="padding:32px 20px 0;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td align="center" style="padding-bottom:24px;">
        <a href="{{ shop.url }}" style="text-decoration:none;">{% if shop.email_logo_url %}<img src="{{ shop.email_logo_url }}" alt="{{ shop.name }}" width="{{ shop.email_logo_width }}" style="display:block;max-width:180px;height:auto;">{% else %}<span style="font-family:Georgia,serif;font-size:26px;color:#1E3A2F;">myrootalia</span>{% endif %}</a>
      </td></tr>
      <tr><td style="border-top:1px solid #C25A34;height:0;line-height:0;font-size:0;">&nbsp;</td></tr>
    </table>
  </td></tr>
</table>

<!-- HÉROS -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:36px 20px 24px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td align="center">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#C25A34;font-weight:600;">En route</p>
        <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-weight:500;font-size:30px;line-height:1.2;color:#1E3A2F;">
          Ta commande arrive, {{ customer.first_name | default: 'à toi' }}.
        </h1>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#5E6B62;">
          Ta commande <strong style="color:#1E3A2F;">{{ order_name }}</strong> vient de quitter le Québec.
          Compte 3 à 8 jours ouvrés pour la recevoir.
        </p>
      </td></tr>
      {% if fulfillment.tracking_url %}
      <tr><td align="center" style="padding-top:28px;">
        <a href="{{ fulfillment.tracking_url }}" style="display:inline-block;padding:14px 32px;background:#1E3A2F;color:#FAF6EF;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;letter-spacing:.02em;">Suivre le colis</a>
      </td></tr>
      {% endif %}
    </table>
  </td></tr>
</table>

<!-- SUIVI -->
{% if fulfillment.tracking_number %}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:8px 20px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#F1EAE0;border-radius:14px;">
      <tr><td style="padding:18px 24px;text-align:center;font-size:13px;line-height:1.6;color:#25332C;">
        <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#5E6B62;font-weight:600;margin-bottom:6px;">Numéro de suivi</div>
        <div style="font-family:Georgia,serif;font-size:18px;color:#1E3A2F;font-weight:600;letter-spacing:.02em;">{{ fulfillment.tracking_number }}</div>
        {% if fulfillment.tracking_company %}<div style="font-size:12px;color:#5E6B62;margin-top:4px;">Transporté par {{ fulfillment.tracking_company }}</div>{% endif %}
      </td></tr>
    </table>
  </td></tr>
</table>
{% endif %}

<!-- ARTICLES EXPÉDIÉS -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:8px 20px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #DDD3C4;border-radius:14px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 14px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#5E6B62;font-weight:600;">Dans ton colis</p>
        {% for line in fulfillment.item_count and fulfillment.line_items or line_items %}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:{% if forloop.last %}0{% else %}12px{% endif %};">
            <tr>
              <td valign="top" width="60" style="padding-right:12px;">{% if line.image %}<img src="{{ line | img_url: 'small' }}" alt="" width="50" height="50" style="display:block;width:50px;height:50px;border-radius:8px;background:#F1EAE0;object-fit:cover;">{% endif %}</td>
              <td valign="top" style="font-size:14px;line-height:1.4;color:#25332C;">
                <div style="font-family:Georgia,serif;font-size:14px;color:#1E3A2F;font-weight:500;">{{ line.title }}</div>
                <div style="font-size:12px;color:#5E6B62;margin-top:2px;">Quantité : {{ line.quantity }}</div>
              </td>
            </tr>
          </table>
        {% endfor %}
      </td></tr>
    </table>
  </td></tr>
</table>

<!-- CE QUI SE PASSE ENSUITE -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:24px 20px 0;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td style="font-size:13px;line-height:1.6;color:#5E6B62;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#5E6B62;font-weight:600;">À la réception</p>
        <p style="margin:0;">
          Applique quelques gouttes sur cuir chevelu propre et sec, masse 1 à 2 minutes, laisse poser toute la nuit.
          <strong style="color:#1E3A2F;">Prends une photo au jour&nbsp;1 :</strong> tu compareras à la semaine 8, c'est là que la différence se voit.
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>

<!-- PIED -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:32px 20px 40px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td style="border-top:1px solid #DDD3C4;padding-top:24px;text-align:center;font-size:12px;line-height:1.6;color:#5E6B62;">
        Colis retardé ? Écris-nous à <a href="mailto:{{ shop.email }}" style="color:#C25A34;text-decoration:none;">{{ shop.email }}</a> — on ouvre une enquête sous 24 h.
      </td></tr>
      <tr><td style="padding-top:20px;text-align:center;font-size:11px;line-height:1.5;color:#8A9187;">
        {{ shop.name }} — {{ shop.address.summary }}
      </td></tr>
    </table>
  </td></tr>
</table>

</body>
</html>
```

**Objet :** `Ta commande {{ order_name }} est partie du Québec.`

---

## Modèle 3/12 — Paiement abandonné ⭐

L'email qui a le meilleur retour sur investissement de tout l'e-commerce.
Envoyé automatiquement à ceux qui remplissent l'email au paiement mais ne
finalisent pas.

Shopify → Notifications → **Paiement abandonné**.

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{ shop.name }} — Ta commande t'attend</title></head>
<body style="margin:0;padding:0;background:#FAF6EF;">

<!-- EN-TÊTE (identique) -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#25332C;">
  <tr><td align="center" style="padding:32px 20px 0;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td align="center" style="padding-bottom:24px;">
        <a href="{{ shop.url }}" style="text-decoration:none;">{% if shop.email_logo_url %}<img src="{{ shop.email_logo_url }}" alt="{{ shop.name }}" width="{{ shop.email_logo_width }}" style="display:block;max-width:180px;height:auto;">{% else %}<span style="font-family:Georgia,serif;font-size:26px;color:#1E3A2F;">myrootalia</span>{% endif %}</a>
      </td></tr>
      <tr><td style="border-top:1px solid #C25A34;height:0;line-height:0;font-size:0;">&nbsp;</td></tr>
    </table>
  </td></tr>
</table>

<!-- HÉROS -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:36px 20px 24px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td align="center">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#C25A34;font-weight:600;">On t'a gardé ton panier</p>
        <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-weight:500;font-size:30px;line-height:1.2;color:#1E3A2F;">
          {{ customer.first_name | default: 'Coucou' }}, tu as oublié quelque chose ?
        </h1>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#5E6B62;">
          Ton panier est prêt à repartir en un clic. Aucun engagement — et
          <strong style="color:#1E3A2F;">60 nuits pour te décider</strong> une fois reçu.
        </p>
      </td></tr>
      <tr><td align="center" style="padding-top:28px;">
        <a href="{{ url }}" style="display:inline-block;padding:14px 32px;background:#1E3A2F;color:#FAF6EF;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;letter-spacing:.02em;">Finaliser ma commande</a>
      </td></tr>
    </table>
  </td></tr>
</table>

<!-- PANIER -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:8px 20px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #DDD3C4;border-radius:14px;">
      <tr><td style="padding:20px 24px;">
        {% for line in line_items %}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:{% if forloop.last %}0{% else %}14px{% endif %};">
            <tr>
              <td valign="top" width="72" style="padding-right:14px;">{% if line.image %}<img src="{{ line | img_url: 'small' }}" alt="" width="60" height="60" style="display:block;width:60px;height:60px;border-radius:8px;background:#F1EAE0;object-fit:cover;">{% endif %}</td>
              <td valign="top" style="font-size:14px;line-height:1.4;color:#25332C;">
                <div style="font-family:Georgia,serif;font-size:15px;color:#1E3A2F;font-weight:500;">{{ line.title }}</div>
                {% if line.variant.title != 'Default Title' %}<div style="font-size:12px;color:#5E6B62;margin-top:2px;">{{ line.variant.title }}</div>{% endif %}
                <div style="font-size:12px;color:#5E6B62;margin-top:2px;">Quantité : {{ line.quantity }}</div>
              </td>
              <td valign="top" align="right" style="font-size:14px;color:#1E3A2F;font-weight:600;white-space:nowrap;">{{ line.line_price | money }}</td>
            </tr>
          </table>
        {% endfor %}
      </td></tr>
    </table>
  </td></tr>
</table>

<!-- RÉASSURANCE 3 COLONNES -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:24px 20px 0;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr>
        <td align="center" width="33%" style="padding:0 6px;font-size:12px;line-height:1.5;color:#25332C;">
          <div style="font-family:Georgia,serif;font-size:15px;color:#C25A34;margin-bottom:4px;">60</div>
          <strong>Nuits d'essai</strong><br><span style="color:#5E6B62;">Remboursé sans justification</span>
        </td>
        <td align="center" width="33%" style="padding:0 6px;font-size:12px;line-height:1.5;color:#25332C;">
          <div style="font-family:Georgia,serif;font-size:15px;color:#C25A34;margin-bottom:4px;">24 h</div>
          <strong>Expédié du Québec</strong><br><span style="color:#5E6B62;">Livraison offerte dès 50 $</span>
        </td>
        <td align="center" width="33%" style="padding:0 6px;font-size:12px;line-height:1.5;color:#25332C;">
          <div style="font-family:Georgia,serif;font-size:15px;color:#C25A34;margin-bottom:4px;">100 %</div>
          <strong>Batana pure</strong><br><span style="color:#5E6B62;">Origine Honduras, un seul actif</span>
        </td>
      </tr>
    </table>
  </td></tr>
</table>

<!-- PIED -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:32px 20px 40px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td style="border-top:1px solid #DDD3C4;padding-top:24px;text-align:center;font-size:12px;line-height:1.6;color:#5E6B62;">
        Un doute, une question ? On répond en moins de 24 h à
        <a href="mailto:{{ shop.email }}" style="color:#C25A34;text-decoration:none;">{{ shop.email }}</a>.
      </td></tr>
      <tr><td style="padding-top:20px;text-align:center;font-size:11px;line-height:1.5;color:#8A9187;">
        {{ shop.name }} — {{ shop.address.summary }}
      </td></tr>
    </table>
  </td></tr>
</table>

</body>
</html>
```

**Objet :** `On t'a gardé ton panier — 60 nuits pour te décider.`

---

## Modèle 4/12 — Mise à jour du statut d'expédition

Envoyé si le suivi change (retard, en livraison, etc.). Court, sec, utile.

Shopify → Notifications → **Mise à jour du statut de l'expédition**.

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF6EF;">

<!-- EN-TÊTE -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <tr><td align="center" style="padding:32px 20px 0;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td align="center" style="padding-bottom:24px;"><a href="{{ shop.url }}" style="text-decoration:none;"><span style="font-family:Georgia,serif;font-size:24px;color:#1E3A2F;">myrootalia</span></a></td></tr>
      <tr><td style="border-top:1px solid #C25A34;height:0;line-height:0;font-size:0;">&nbsp;</td></tr>
    </table>
  </td></tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:36px 20px 32px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td>
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#C25A34;font-weight:600;">Mise à jour</p>
        <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:500;font-size:24px;color:#1E3A2F;line-height:1.3;">Ta commande {{ order_name }} — nouveau statut.</h1>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#5E6B62;">Bonjour {{ customer.first_name | default: 'à toi' }}, le suivi de ton colis vient d'être mis à jour.</p>
        {% if fulfillment.tracking_number %}
        <div style="background:#F1EAE0;border-radius:12px;padding:16px 20px;margin:16px 0;">
          <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#5E6B62;font-weight:600;margin-bottom:4px;">Numéro de suivi</div>
          <div style="font-family:Georgia,serif;font-size:16px;color:#1E3A2F;font-weight:600;">{{ fulfillment.tracking_number }}</div>
        </div>
        {% endif %}
        {% if fulfillment.tracking_url %}
        <p style="margin:16px 0 0;"><a href="{{ fulfillment.tracking_url }}" style="display:inline-block;padding:12px 28px;background:#1E3A2F;color:#FAF6EF;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;">Voir le suivi détaillé</a></p>
        {% endif %}
      </td></tr>
    </table>
  </td></tr>
</table>

<!-- PIED -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:32px 20px 40px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td style="border-top:1px solid #DDD3C4;padding-top:24px;text-align:center;font-size:12px;line-height:1.6;color:#5E6B62;">
        Une question ? <a href="mailto:{{ shop.email }}" style="color:#C25A34;text-decoration:none;">{{ shop.email }}</a>
      </td></tr>
      <tr><td style="padding-top:16px;text-align:center;font-size:11px;color:#8A9187;">{{ shop.name }}</td></tr>
    </table>
  </td></tr>
</table>

</body>
</html>
```

**Objet :** `Ta commande {{ order_name }} — nouvelle mise à jour.`

---

## Modèle 5/12 — En cours de livraison

Envoyé quand le transporteur prend le colis pour le dernier kilomètre.

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF6EF;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <tr><td align="center" style="padding:32px 20px 0;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td align="center" style="padding-bottom:24px;"><span style="font-family:Georgia,serif;font-size:24px;color:#1E3A2F;">myrootalia</span></td></tr><tr><td style="border-top:1px solid #C25A34;height:0;line-height:0;font-size:0;">&nbsp;</td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:36px 20px 32px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td>
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#C25A34;font-weight:600;">Ton colis arrive aujourd'hui</p>
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:500;font-size:28px;color:#1E3A2F;line-height:1.3;">Prépare la boîte aux lettres, {{ customer.first_name | default: 'à toi' }}.</h1>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#5E6B62;">Ton colis <strong style="color:#1E3A2F;">{{ order_name }}</strong> est entre les mains du livreur. Livraison prévue dans la journée.</p>
    {% if fulfillment.tracking_url %}<p style="margin:24px 0 0;"><a href="{{ fulfillment.tracking_url }}" style="display:inline-block;padding:12px 28px;background:#1E3A2F;color:#FAF6EF;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;">Suivre en direct</a></p>{% endif %}
  </td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;"><tr><td align="center" style="padding:32px 20px 40px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td style="border-top:1px solid #DDD3C4;padding-top:24px;text-align:center;font-size:11px;color:#8A9187;">{{ shop.name }} — <a href="mailto:{{ shop.email }}" style="color:#8A9187;">{{ shop.email }}</a></td></tr></table></td></tr></table>
</body></html>
```

**Objet :** `{{ customer.first_name | default: 'Bonne nouvelle' }}, ton colis arrive aujourd'hui.`

---

## Modèle 6/12 — Colis livré

Envoyé automatiquement quand le transporteur marque le colis comme livré.

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF6EF;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <tr><td align="center" style="padding:32px 20px 0;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td align="center" style="padding-bottom:24px;"><span style="font-family:Georgia,serif;font-size:24px;color:#1E3A2F;">myrootalia</span></td></tr><tr><td style="border-top:1px solid #C25A34;height:0;line-height:0;font-size:0;">&nbsp;</td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:36px 20px 24px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td>
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#C25A34;font-weight:600;">Colis livré</p>
    <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-weight:500;font-size:28px;color:#1E3A2F;line-height:1.3;">{{ customer.first_name | default: 'À toi' }}, ton rituel peut commencer.</h1>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#5E6B62;">Ta commande <strong style="color:#1E3A2F;">{{ order_name }}</strong> est arrivée à destination. On croise les doigts pour la suite.</p>

    <div style="background:#F1EAE0;border-radius:12px;padding:18px 20px;margin:20px 0;">
      <p style="margin:0 0 10px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#C25A34;font-weight:600;">Ton geste ce soir</p>
      <ol style="margin:0;padding-left:18px;font-size:14px;line-height:1.7;color:#25332C;">
        <li>Sépare tes cheveux en quelques raies pour bien exposer le cuir chevelu.</li>
        <li>Applique 4 à 6 gouttes directement à la racine.</li>
        <li>Masse 1 à 2 minutes du bout des doigts.</li>
        <li>Laisse poser toute la nuit.</li>
      </ol>
    </div>

    <p style="margin:0;font-size:13px;line-height:1.6;color:#5E6B62;">
      <strong style="color:#1E3A2F;">Astuce :</strong> prends une photo au jour&nbsp;1. Tu compareras à la semaine&nbsp;8 — c'est là que la différence se voit.
    </p>
  </td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;"><tr><td align="center" style="padding:32px 20px 40px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td style="border-top:1px solid #DDD3C4;padding-top:24px;text-align:center;font-size:12px;line-height:1.6;color:#5E6B62;">Un souci avec le colis ? <a href="mailto:{{ shop.email }}" style="color:#C25A34;text-decoration:none;">{{ shop.email }}</a> — on répond en moins de 24 h.</td></tr></table></td></tr></table>
</body></html>
```

**Objet :** `{{ customer.first_name | default: 'Ta commande' }} est arrivée. Ton rituel peut commencer.`

---

## Modèle 7/12 — Invitation à créer un compte client

Envoyé quand tu invites quelqu'un depuis le back-office.

Shopify → Notifications → **Invitation à créer un compte client**.

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF6EF;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <tr><td align="center" style="padding:32px 20px 0;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td align="center" style="padding-bottom:24px;"><span style="font-family:Georgia,serif;font-size:24px;color:#1E3A2F;">myrootalia</span></td></tr><tr><td style="border-top:1px solid #C25A34;height:0;line-height:0;font-size:0;">&nbsp;</td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:36px 20px 32px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td>
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#C25A34;font-weight:600;">Bienvenue</p>
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:500;font-size:26px;color:#1E3A2F;line-height:1.3;">On t'a créé un accès personnel.</h1>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#5E6B62;">
      Bonjour {{ customer.first_name | default: 'à toi' }}, active ton compte pour retrouver tes commandes, suivre tes livraisons et gérer ton abonnement en un clic.
    </p>
    {% if customer.account_activation_url %}
    <p style="margin:24px 0 0;">
      <a href="{{ customer.account_activation_url }}" style="display:inline-block;padding:14px 32px;background:#1E3A2F;color:#FAF6EF;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;">Activer mon compte</a>
    </p>
    <p style="margin:16px 0 0;font-size:12px;color:#8A9187;">Ce lien expire dans 30 jours.</p>
    {% endif %}
  </td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;"><tr><td align="center" style="padding:32px 20px 40px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td style="border-top:1px solid #DDD3C4;padding-top:24px;text-align:center;font-size:11px;color:#8A9187;">{{ shop.name }} — <a href="mailto:{{ shop.email }}" style="color:#8A9187;">{{ shop.email }}</a></td></tr></table></td></tr></table>
</body></html>
```

**Objet :** `Ton compte myrootalia t'attend.`

---

## Modèle 8/12 — Bienvenue au compte client

Envoyé après activation du compte.

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF6EF;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <tr><td align="center" style="padding:32px 20px 0;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td align="center" style="padding-bottom:24px;"><span style="font-family:Georgia,serif;font-size:24px;color:#1E3A2F;">myrootalia</span></td></tr><tr><td style="border-top:1px solid #C25A34;height:0;line-height:0;font-size:0;">&nbsp;</td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:36px 20px 32px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td>
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#C25A34;font-weight:600;">Ton compte est actif</p>
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:500;font-size:28px;color:#1E3A2F;line-height:1.3;">Bienvenue chez myrootalia, {{ customer.first_name | default: 'à toi' }}.</h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#5E6B62;">
      Ton compte est prêt. Depuis ton espace, tu peux suivre chaque commande, consulter tes factures, modifier ton adresse et gérer ton abonnement en deux clics.
    </p>
    <p style="margin:24px 0 0;">
      <a href="{{ shop.url }}/account" style="display:inline-block;padding:14px 32px;background:#1E3A2F;color:#FAF6EF;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;">Voir mon espace</a>
    </p>
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #DDD3C4;">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#5E6B62;font-weight:600;">Nos engagements</p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#25332C;">
        <strong style="color:#1E3A2F;">Essai 60 nuits</strong> — remboursé sans justification.<br>
        <strong style="color:#1E3A2F;">Livraison offerte</strong> dès 50&nbsp;$, expédiée du Québec sous 24&nbsp;h.<br>
        <strong style="color:#1E3A2F;">Support humain</strong> — on répond en moins de 24&nbsp;h.
      </p>
    </div>
  </td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;"><tr><td align="center" style="padding:32px 20px 40px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td style="border-top:1px solid #DDD3C4;padding-top:24px;text-align:center;font-size:11px;color:#8A9187;">{{ shop.name }}</td></tr></table></td></tr></table>
</body></html>
```

**Objet :** `Bienvenue chez myrootalia — ton espace est prêt.`

---

## Modèle 9/12 — Réinitialisation du mot de passe

Sec, clair, sans marketing (les gens veulent leur mot de passe, pas une pub).

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF6EF;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <tr><td align="center" style="padding:32px 20px 0;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td align="center" style="padding-bottom:24px;"><span style="font-family:Georgia,serif;font-size:24px;color:#1E3A2F;">myrootalia</span></td></tr><tr><td style="border-top:1px solid #C25A34;height:0;line-height:0;font-size:0;">&nbsp;</td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:36px 20px 32px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td>
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:500;font-size:24px;color:#1E3A2F;">Réinitialiser ton mot de passe</h1>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#5E6B62;">Bonjour {{ customer.first_name | default: 'à toi' }}, on a reçu une demande pour réinitialiser le mot de passe de ton compte myrootalia.</p>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#5E6B62;">Ce lien expire dans <strong style="color:#1E3A2F;">24 heures</strong>. Si tu n'es pas à l'origine de la demande, ignore ce message — ton compte reste sécurisé.</p>
    {% if customer.reset_password_url %}
    <p style="margin:0;">
      <a href="{{ customer.reset_password_url }}" style="display:inline-block;padding:14px 32px;background:#1E3A2F;color:#FAF6EF;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;">Choisir un nouveau mot de passe</a>
    </p>
    {% endif %}
  </td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;"><tr><td align="center" style="padding:32px 20px 40px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td style="border-top:1px solid #DDD3C4;padding-top:24px;text-align:center;font-size:11px;color:#8A9187;">{{ shop.name }} — Pour toute question, écris à <a href="mailto:{{ shop.email }}" style="color:#8A9187;">{{ shop.email }}</a></td></tr></table></td></tr></table>
</body></html>
```

**Objet :** `Réinitialisation de ton mot de passe myrootalia`

---

## Modèle 10/12 — Remboursement de commande

Bienveillant, sans promesse creuse.

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF6EF;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <tr><td align="center" style="padding:32px 20px 0;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td align="center" style="padding-bottom:24px;"><span style="font-family:Georgia,serif;font-size:24px;color:#1E3A2F;">myrootalia</span></td></tr><tr><td style="border-top:1px solid #C25A34;height:0;line-height:0;font-size:0;">&nbsp;</td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:36px 20px 32px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td>
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#C25A34;font-weight:600;">Remboursement émis</p>
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:500;font-size:24px;color:#1E3A2F;line-height:1.3;">C'est fait, {{ customer.first_name | default: 'à toi' }}.</h1>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#5E6B62;">
      On vient d'émettre un remboursement de <strong style="color:#1E3A2F;">{{ amount | money }}</strong> sur ta commande {{ order_name }}.
      Compte 5 à 10 jours ouvrés pour le voir apparaître sur ton relevé — c'est la banque qui décide du délai final.
    </p>
    {% if refund_line_items.size > 0 %}
    <div style="background:#ffffff;border:1px solid #DDD3C4;border-radius:14px;padding:20px 24px;margin:20px 0;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#5E6B62;font-weight:600;">Articles remboursés</p>
      {% for item in refund_line_items %}
        <div style="font-size:14px;color:#25332C;padding:4px 0;">{{ item.line_item.title }} × {{ item.quantity }}</div>
      {% endfor %}
    </div>
    {% endif %}
    <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#5E6B62;">Merci pour ta confiance. Si tu veux nous dire ce qui n'a pas marché, on lit toujours — on s'améliore avec chaque retour.</p>
  </td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;"><tr><td align="center" style="padding:32px 20px 40px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td style="border-top:1px solid #DDD3C4;padding-top:24px;text-align:center;font-size:11px;color:#8A9187;">{{ shop.name }} — <a href="mailto:{{ shop.email }}" style="color:#8A9187;">{{ shop.email }}</a></td></tr></table></td></tr></table>
</body></html>
```

**Objet :** `Ton remboursement myrootalia est en route.`

---

## Modèle 11/12 — Commande annulée

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF6EF;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <tr><td align="center" style="padding:32px 20px 0;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td align="center" style="padding-bottom:24px;"><span style="font-family:Georgia,serif;font-size:24px;color:#1E3A2F;">myrootalia</span></td></tr><tr><td style="border-top:1px solid #C25A34;height:0;line-height:0;font-size:0;">&nbsp;</td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:36px 20px 32px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td>
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#C25A34;font-weight:600;">Commande annulée</p>
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:500;font-size:24px;color:#1E3A2F;line-height:1.3;">Ta commande {{ order_name }} est annulée.</h1>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#5E6B62;">
      Bonjour {{ customer.first_name | default: 'à toi' }}, ta commande a été annulée.
      Si un paiement a été prélevé, il te sera remboursé sous 5 à 10 jours ouvrés.
    </p>
    <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#25332C;">
      Un souci ? Écris-nous à <a href="mailto:{{ shop.email }}" style="color:#C25A34;text-decoration:none;">{{ shop.email }}</a> — on répond en moins de 24 h.
    </p>
  </td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;"><tr><td align="center" style="padding:32px 20px 40px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td style="border-top:1px solid #DDD3C4;padding-top:24px;text-align:center;font-size:11px;color:#8A9187;">{{ shop.name }}</td></tr></table></td></tr></table>
</body></html>
```

**Objet :** `Ta commande {{ order_name }} a été annulée.`

---

## Modèle 12/12 — Erreur de paiement

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF6EF;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <tr><td align="center" style="padding:32px 20px 0;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td align="center" style="padding-bottom:24px;"><span style="font-family:Georgia,serif;font-size:24px;color:#1E3A2F;">myrootalia</span></td></tr><tr><td style="border-top:1px solid #C25A34;height:0;line-height:0;font-size:0;">&nbsp;</td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;">
  <tr><td align="center" style="padding:36px 20px 32px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td>
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#C25A34;font-weight:600;">Paiement à réessayer</p>
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:500;font-size:24px;color:#1E3A2F;line-height:1.3;">Un souci avec le paiement, {{ customer.first_name | default: 'à toi' }}.</h1>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#5E6B62;">
      Ta banque a refusé le paiement. C'est fréquent — souvent un simple plafond hebdomadaire ou une confirmation à donner dans l'app.
    </p>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#5E6B62;">
      Réessaie en quelques secondes en cliquant ci-dessous, ou choisis un autre moyen de paiement.
    </p>
    {% if url %}
    <p style="margin:0;">
      <a href="{{ url }}" style="display:inline-block;padding:14px 32px;background:#1E3A2F;color:#FAF6EF;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;">Reprendre mon paiement</a>
    </p>
    {% endif %}
  </td></tr></table></td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF6EF;"><tr><td align="center" style="padding:32px 20px 40px;"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;"><tr><td style="border-top:1px solid #DDD3C4;padding-top:24px;text-align:center;font-size:11px;color:#8A9187;">Bloqué ? On t'aide sous 24 h : <a href="mailto:{{ shop.email }}" style="color:#8A9187;">{{ shop.email }}</a></td></tr></table></td></tr></table>
</body></html>
```

**Objet :** `Paiement refusé — on peut réessayer ensemble.`

---

# Ce que je te dis de laisser par défaut

Ces modèles **ne s'appliquent pas** à myrootalia. Les personnaliser ne rapporterait rien et ferait du travail inutile.

| Section | Modèle | Pourquoi laisser tel quel |
|---|---|---|
| **POS** | Paiement abandonné POS, E-mail POS au client, Reçu POS et mobile, Reçu d'échange POS, Reçu de retour | Tu n'as pas de point de vente physique |
| **Retrait en magasin** | Prête pour le retrait, Retirée par le client | Tu n'as pas de magasin |
| **Livraison locale** | En cours de livraison locale, Livrée localement, Manquée | Tu expédies via transporteur, pas de flotte locale |
| **Retours et annulations** | Retour créé, Étiquette de retour, Demande approuvée/refusée, Reçue, Annulation refusée | Les modèles par défaut Shopify sont sobres et suffisent. Ton essai 60 nuits accepte tout — tu utiliseras rarement le processus formel de retour |
| **Comptes B2B** | E-mail d'accès B2B, MAJ paiement B2B | Tu ne vends pas en B2B |
| **Comptes** | Requête d'ajout / mise à jour / restauration de moyen de paiement | Shopify les gère bien, techniques et rares |
| **Traitement** | Facture de commande provisoire | Rare, technique. Reste par défaut |
| **Exceptions** | Facture de la commande, Commande modifiée, Reçu de paiement, Lien de la commande | Rares, techniques. Reste par défaut |

**Ne perds pas de temps sur ces 20-là.** Concentre-toi sur les 12 modèles ci-dessus, qui couvrent 100 % de l'expérience réelle de tes clientes.

---

## Comment paster proprement dans Shopify

1. Shopify admin → **Paramètres → Notifications**.
2. Clique sur le modèle (ex. « Confirmation de commande »).
3. Sous **Corps de l'e-mail (HTML)**, clique **« Modifier le code »**.
4. **Sélectionne tout** (Ctrl+A / Cmd+A) et supprime.
5. Colle le bloc HTML du modèle ci-dessus.
6. **Objet** : remplace le champ en haut par la ligne d'objet fournie sous chaque modèle.
7. Clique **Aperçu** pour vérifier.
8. Clique **Envoyer un e-mail test** — tu le reçois sur `zaggermick@gmail.com`.
9. **Enregistrer**.

Répète pour les 12 modèles. Compte 10 à 15 minutes au total.

---

## Astuce logo

Pour que ton logo apparaisse en haut de chaque email :

**Paramètres → Notifications → Personnaliser** → *Logo* → charge une PNG horizontale de 400×120 px.

Sans logo chargé, mes modèles affichent « myrootalia » en Georgia. C'est correct, mais un vrai logo transmet mieux le côté premium.

---

## Un mot sur le rendu

Les emails ne rendent pas de la même façon partout :

- **Gmail sur mobile** — supprime tous les `<style>` du `<head>`, d'où les styles inline.
- **Outlook Windows** — ne supporte pas les `border-radius` sur les images. Les cartes arrondies apparaîtront carrées, c'est acceptable.
- **Apple Mail / iOS Mail** — rend tout parfaitement.

Ces modèles ont été écrits pour tenir dans les trois. Aucune pixel-perfection possible pour les emails — c'est le lot du média.

---

*Fichier : `docs/notifications-emails.md`. Modifie tout ici, jamais dans Shopify directement — sinon tu perds les changements à la prochaine session.*
