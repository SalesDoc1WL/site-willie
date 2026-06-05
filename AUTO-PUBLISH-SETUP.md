# Configuration routine publication auto — site-willie

## TL;DR Workflow

| Étape | Quand | Action | Responsable |
|---|---|---|---|
| 1 | Avant pubDate | `/blog write "Titre du calendrier"` → rédige → `draft: true` | Toi |
| 2 | Avant pubDate | Crée PR + merge vers main | Toi |
| 3 | **Le jour J à 9h UTC** | CI retire `draft: true`, pousse main → **live** | GitHub Actions |

**Zéro intervention après le merge du draft. Tout auto.**

---

## Architecture

### 1. Script vérification : `scripts/verify-articles.mjs`
- Valide frontmatter, dates, catégories, liens internes
- Vérifie longueur, tics IA, style (VOICE.md)
- Lance via `npm run verify` ou dans `publish.sh` (bloque si erreur)

### 2. Workflow CI vérif : `.github/workflows/verify-content.yml`
- Déclenche sur PR touchant `src/content/veille`
- Appelle `npm run verify` (double check)
- Refuse si erreur

### 3. Workflow auto-publish : `.github/workflows/auto-publish.yml`
- Cron : chaque jour 9h UTC
- Détecte `pubDate: YYYY-MM-DD` = aujourd'hui ET `draft: true`
- Lance `scripts/auto-publish.mjs` (retire le flag)
- **Pousse direct vers main** (zéro PR)
- GitHub Pages redeploy auto (~30sec)

---

## Calendrier

Voir : `_reference/CALENDRIER.md` (10 articles T2-T4 2026)

Prochains :
- **18 juin** : Détruire ses originaux papier
- **2 juillet** : Coffre-fort numérique ou SAE
- **16 juillet** : Externaliser le courrier entrant
- ...

---

## Checklist nouvelle publication

1. Ouvre Claude Code à la racine du repo `site-willie`
2. `/blog write "Titre du calendrier"` → skill charge BRAND.md + VOICE.md auto
3. Écris l'article (~300-450 mots)
4. Frontmatter exact :
   ```yaml
   titre: "..."
   description: "..."
   categorie: "Réglementation|Archivage & SAE|Courrier & BPO|Signature & confiance|Secteur public"
   tags: [tag1, tag2]
   pubDate: 2026-06-18
   draft: true
   ```
5. Relis : longueur, liens internes, pas de tics IA
6. `./publish.sh src/content/veille/slug.md`
   - Valide + PR → merge
7. **Oublie. CI fait le reste le jour J.**

---

## Cas spéciaux

### Article cassé avant la date (draft: true)
Édite le fichier dans la branche, pousse la correction (avant merge).

### Annuler publication (avant le jour J)
Retire `draft: false` du fichier et repousse, OU supprime l'article entier.

### Forcer la publi le jour J
Workflow se déclenche auto. Pas besoin de rien faire.

---

## Commandes utiles

```bash
# Vérif local avant PR
npm run verify

# Test publish.sh avec un article
./publish.sh src/content/veille/mon-article.md

# Voir draft articles (bash)
grep -r "draft: true" src/content/veille/

# Voir prochaines pubDates (bash)
grep "pubDate:" src/content/veille/*.md | sort
```

---

## Points clés à retenir

- **Toujours** `draft: true` avant de merger
- **Calendrier** = source unique (pas de dates au pif)
- **CI vérifie** 2×: PR + auto-publish
- **Zéro intervention** entre merge et la date
- **9h UTC** = trigger time (ajuste selon ton fuseau horaire)

---

Generated: 2026-06-05  
Commande d'initialisation : `npm run verify` + `./publish.sh`
