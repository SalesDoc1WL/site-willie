# Design System & Brief — Site CV / Génération de leads
**Willie Leroux — Ingénieur d'affaires · Spécialiste de l'éditique et de la communication multimodale**
*Version 2 — direction « Éditorial » déployée (mise en page expressive sur socle DSFR + charte couleur DocOne).*

> Garde-fou juridique : on s'inspire des codes du DSFR (Marianne, structure institutionnelle) **sans** reproduire le bloc-marque « République Française » ni la Marianne tricolore, réservés aux sites de l'État.
> Mention employeur : **DocOne** (gestion documentaire multicanale, Mérignac) est cité de façon **discrète** dans la légende du hero, le bloc contact et le pied de page — jamais en bloc-marque dominant.

---

## 1. Direction créative
Registre **institutionnel et rassurant** (codes de l'administration française, charte DocOne vert + gris) **enrichi d'une mise en page éditoriale** : typographie XXL, grille à filets fins, listes numérotées, chiffres géants animés, bandes images plein cadre et une vidéo d'ambiance. Objectif : crédibiliser auprès des DAF, DSI, DG, DGA et Secrétaires Généraux (cible PME / ETI privées et secteur public) tout en produisant un effet visuel marquant. La couleur reste un signal, pas un décor ; le vert électrique sert d'accent ponctuel.

---

## 2. Tokens (`src/styles/tokens.css`)

### Couleurs
| Token | Hex | Usage |
|---|---|---|
| `--vert` | `#00906C` | Couleur principale : boutons, accents, liserés, stats |
| `--vert-h` | `#006E52` | Survol des éléments verts |
| `--vert-a` | `#00543F` | État actif ; fonds verts pleins (diagnostic, split) |
| `--vert-elec` | `#00C896` | Accent lumineux ponctuel (marquee, liseré, surtitres sur fond sombre) |
| `--gris` | `#707070` | Second ton du logo, libellés, numéros de section |
| `--gris-fonce` | `#4A4A4A` | Badges de normes |
| `--t1` | `#161616` | Titres |
| `--t2` | `#3A3A3A` | Texte courant |
| `--t-mention` | `#666666` | Mentions, légendes |
| `--bg` | `#FFFFFF` | Fond |
| `--alt` | `#F5F7F6` | Sections alternées, champs |
| `--contrast` | `#ECEEED` | Fonds neutres (jauges, placeholders) |
| `--callout` | `#EDF6F2` | Encarts (vert très clair) |
| `--border` | `#DDDDDD` | Bordures |
| `--border-vert` | `#BFE0D5` | Bordures vertes claires |

- **Accent piloté** : sur la page d'accueil, `--accent` (défaut `var(--vert)`) centralise la couleur d'accent ; il suffit de le repointer vers `--vert-elec` pour basculer toute la page en accent électrique.
- **Liseré de marque** (header + footer) : bande verticale `linear-gradient(var(--vert) 0 50%, var(--gris) 50% 100%)`.

### Typographie
- **Marianne** (Regular 400 / Medium 500 / Bold 700), titres et texte. Chargée via CDN DSFR (`@gouvfr/dsfr@1.13.0`). Repli : Arial, sans-serif.
- Sur-titres (« overline ») : 0.8–0.875 rem, gras, vert, majuscules, interlettrage `.12em`.
- Échelle éditoriale :
  - **H1 hero** `clamp(2.4rem, 6.6vw, 5.4rem)`, interligne ~.98, `letter-spacing -.03em`.
  - **Titres de section** `clamp(1.9rem, 4.4vw, 3.3rem)`.
  - **Chiffres géants (stats)** `clamp(2.6rem, 7vw, 5rem)`, vert.
  - Corps 1 rem / intro 1.05–1.3 rem.
- Un mot-clé du H1 est mis en accent vert (`<em>` sans italique).

### Formes & motion
- **Coins carrés** (radius 0), bordures 1 px nettes, soulignements 2–4 px, filets de séparation.
- Transitions courtes (0.15–0.25 s). **Apparition au scroll** (`.reveal` → `.in`, fondu + translation) et **compteurs animés** une fois à l'entrée dans le viewport (`public/scripts/reveal.js`).
- **Marquee** des normes (défilement horizontal continu sur bande sombre).
- `prefers-reduced-motion` respecté (animations désactivées).

---

## 3. Composants
- **Header** (partagé, sticky) : liseré vert/gris, « Willie Leroux » + sous-titre « Spécialiste de l'éditique & de la communication multimodale » (masqué < 1100 px), navigation (Expertises, Secteurs, Cas, Veille), bouton vert « Réserver un échange », burger mobile.
- **Boutons** : carrés. Primaire vert plein ; secondaire contour vert ; variante claire (`btn-light`) sur fond vert ; flèche en suffixe (`.arrow`).
- **Marquee normes** : bande `--t1`, normes en blanc, sigle en `--vert-elec`, défilement continu.
- **Expertises — liste numérotée** : filet haut, lignes `01…06`, libellé de norme, titre, phrase, flèche ; survol = liseré gauche vert + décalage. Données issues de la collection `expertises`.
- **Bande image plein cadre** : photo + dégradé sombre + cartouche texte (surtitre vert électrique + titre blanc).
- **Bande Diagnostic** : fond `--vert-a`, image de fond en faible opacité, chiffre fantôme « 30' », texte blanc, CTA clair.
- **Stats** : grille à filets, grand chiffre vert animé + libellé.
- **Cartes Références** : grille à filets, étiquette secteur, liste à puces fléchées.
- **Split « Confiance numérique »** : 2 colonnes (texte + **vidéo d'ambiance** HD en boucle muette).
- **Cartes Articles** : vignette (photo) + badge catégorie + titre + description + date + « Lire ». Données issues de la collection `veille`, vignette mappée par slug.
- **Contact** : formulaire RGPD branché **Web3Forms** (composant `Contact.astro`), plus liens Rendez-vous / LinkedIn / e-mail / localisation.
- **Footer** : filet haut vert, liseré de marque, sous-titre « éditique & communication multimodale », mention **« Au sein de DocOne · Mérignac (33) »**, colonnes de liens, mentions légales.
- **Avatar de marque** (`public/img/avatar.svg`) : monogramme **WL** sur carte verte (dégradé, accent électrique, liseré, motif de lignes documentaires). **Désactivé pour l'instant** sur le hero (markup conservé en commentaire dans `index.astro`) ; réactivable à tout moment.
- **Badges de normes** : NF 544 · NF 461 · NF K11-112 · ISO 9001 · ISO 27001 · HDS · eIDAS, en gris foncé.

---

## 4. Architecture (page d'accueil, sections ancrées)
1. Header · 2. Hero (accroche-question + accent vert + CTA ; avatar optionnel) · 3. Marquee normes · 4. Positionnement · 5. Bande image « Le constat » · 6. Expertises (liste numérotée) · 7. Diagnostic (bande verte) · 8. Résultats (stats + 6 références) · 9. Split « Confiance numérique » + vidéo · 10. Articles (veille) · 11. Contact · 12. Footer.

> La section « Parcours / Qui je suis » a été **retirée**.

---

## 5. Contenu (en ligne)

**Hero**
- Sur-titre : `Flux documentaires · entrants & sortants`
- Titre : Combien de jours entre l'arrivée d'un courrier et sa *prise en compte réelle* ?
- Sous-titre : J'aide les directions d'ETI, de PME et d'organismes publics à industrialiser le traitement de leurs documents, du courrier entrant jusqu'à l'archivage à valeur probante.
- CTA : Réserver 30 min → https://calendly.com/willie-leroux38/30min · Voir mes expertises
- Légende (avatar) : Willie Leroux — Ingénieur d'affaires · DocOne, Mérignac (33)

**Positionnement** — Vos documents circulent encore trop lentement.
J'interviens auprès des DAF, DSI, DG, DGA et Secrétaires Généraux d'organisations de 50 à 5 000 collaborateurs. Le point commun : un courrier entrant traité à la main, des délais qui s'allongent, des archives dont la valeur juridique n'est pas garantie. Mon rôle est de cartographier ces flux et de les remettre sous contrôle.

**Bande « Le constat »** — Des kilomètres de documents, encore traités au rythme du papier.
Un pli ouvert à la main, un dossier classé à la main : c'est du temps perdu, et une valeur juridique qui n'est plus garantie.

**Expertises (6, depuis la collection)**
| Norme | Titre | Phrase |
|---|---|---|
| BPO | Courrier entrant externalisé | Tri, numérisation, indexation et distribution numérique, de bout en bout. |
| NF 544 | Numérisation copie fidèle | Copie numérique juridiquement opposable, destruction des originaux papier. |
| NF 461 | Archivage électronique (SAE) | Intégrité, traçabilité et force probante sur toute la durée de conservation. |
| eIDAS | Recommandé électronique | Envoi recommandé dématérialisé, conforme et opposable (ERE / LRE). |
| GED | Documents vivants | Documents centralisés, accessibles et partagés. |
| KYC · 2D-Doc | Éditique & confiance | Marketing direct, signature électronique, identification client, cachet 2D-Doc. |

**Diagnostic** — Un échange de 30 à 60 minutes pour cartographier vos flux.
Sans démonstration produit, sans engagement. On regarde ensemble comment vos documents entrent, circulent et sont conservés, et où se trouvent les points de friction. Vous repartez avec une vision claire de votre maturité documentaire et des premières pistes. CTA : Réserver mon créneau.

**Résultats — stats animées**
- 2 000+ courriers/jour — établissement public financier
- 15 ans de partenariat — assureur national
- 30 000 plis postaux/an — acteur du financement
- 6 normes & certifications mobilisées

**Résultats — références (anonymisées)** : Banque, Secteur public, Assurance, Protection sociale, Courtage, Collectivités (voir `index.astro` pour le détail des puces).

**Split « Confiance numérique »** — La valeur juridique ne se décrète pas. Elle se prouve.
Copie fidèle NF 544, archivage NF 461, recommandé eIDAS : chaque maillon est tracé, horodaté et opposable. La chaîne de numérisation, de l'ouverture du pli à l'indexation, tient devant un juge. (Colonne droite : vidéo d'ambiance HD en boucle.)

**Articles** — Veille & décryptages (6, depuis la collection `veille`).
Normes, conformité, dématérialisation du courrier : de quoi situer votre maturité documentaire sans jargon.

**Contact**
- Formulaire : Nom · Organisation · Fonction · E-mail professionnel · Message (Web3Forms).
- Mention RGPD : données utilisées uniquement pour recontacter, jamais cédées.
- Liens : RDV https://calendly.com/willie-leroux38/30min · LinkedIn https://www.linkedin.com/in/willie-leroux-docone/ · E-mail wleroux@docone.fr · Mérignac, Nouvelle-Aquitaine.

---

## 6. Imagerie & médias
- **Photos** libres de droit (Pexels), en **couleurs naturelles** (le lavis vert « duotone » a été retiré). Stockées dans `public/img/home/`.
- **Vidéo d'ambiance** : `public/img/home/ambient.mp4` (720p, ~16 s, boucle muette) — effet Ken Burns généré localement à partir des photos libres, donc sans contrainte de licence.
- **Avatar** : `public/img/avatar.svg` (monogramme de marque, désactivé pour l'instant).
- **Portrait photo** : `public/img/willie.jpg` conservé comme image Open Graph (les SVG sont mal pris en charge en OG). Pour un vrai portrait éditorial dans le hero, déposer une photo HD et réactiver le bloc avatar/portrait.

---

## 7. À fournir / à finaliser
- Photo de portrait HD si l'on veut afficher un visage (sinon avatar de marque ou hero sans média).
- Vidéo HD « métier » de remplacement pour le split, si souhaité (le clip actuel est une ambiance générée).
- Remplacer les chiffres des stats si des résultats plus récents sont disponibles.
- E-mail pro déjà branché (`wleroux@docone.fr`) ; formulaire Web3Forms actif (clé en place dans `src/lib/url.js`).

---

## 8. Notes
- Tous les textes rédigés pour le site sont passés au filtre « humanizer » (suppression des tournures typiques d'IA) ; la copie de marque validée a été préservée.
- Marianne est chargée via le CDN DSFR (licence d'État). Pour un build « licence-clean », basculer le repli en Arial.
- Une **galerie de 4 directions** (Éditorial, Flux, Immersif, Signal vert) reste disponible hors production sous `public/refonte/` (non déployée).
