#!/usr/bin/env bash
# publish.sh — publie un article dans la collection "veille" du site Astro
# (willie-leroux.fr). Valide le frontmatter AVANT de pousser pour ne jamais
# casser le build GitHub Pages.
#
# Usage :  ./publish.sh chemin/vers/article.md
# À placer à la racine du repo site-willie.

set -euo pipefail

SRC="${1:?Usage: ./publish.sh <article.md>}"
DEST="src/content/veille"
CATS=("Réglementation" "Archivage & SAE" "Courrier & BPO" \
      "Signature & confiance" "Secteur public")

[ -f "$SRC" ] || { echo "❌ fichier introuvable : $SRC"; exit 1; }

# 1. Isoler le frontmatter (lignes entre le 1er et le 2e ---)
fm=$(awk '/^---[[:space:]]*$/{n++; next} n==1{print}' "$SRC")

# 2. Champs obligatoires (noms FR du schéma Zod)
for champ in titre description categorie pubDate; do
  grep -q "^${champ}:" <<<"$fm" \
    || { echo "❌ champ manquant dans le frontmatter : $champ"; exit 1; }
done

# 3. categorie doit appartenir à la liste autorisée
cat_val=$(grep "^categorie:" <<<"$fm" \
          | sed 's/^categorie:[[:space:]]*//; s/^["'\'']//; s/["'\'']$//')
ok=0; for c in "${CATS[@]}"; do [ "$cat_val" = "$c" ] && ok=1; done
if [ "$ok" != 1 ]; then
  echo "❌ categorie invalide : '$cat_val'"
  printf '   valeurs autorisées : %s\n' "${CATS[@]}"
  exit 1
fi

# 3bis. Vérification automatique (sources / dates / véracité / style)
#       Bloque la publication si une ERREUR est détectée (lien mort, date
#       absurde, catégorie invalide…). Les avertissements n'arrêtent pas.
if command -v node >/dev/null 2>&1; then
  echo "🔎 Vérification de l'article…"
  node scripts/verify-articles.mjs "$SRC" \
    || { echo "❌ vérification échouée : corrige les erreurs avant de publier."; exit 1; }
else
  echo "⚠️  node introuvable : vérification automatique ignorée."
fi

# 4. Publier (slug = nom de fichier sans extension)
slug=$(basename "$SRC" .md)
cp "$SRC" "$DEST/$slug.md"
git add "$DEST/$slug.md"
git commit -m "veille: $slug"
git push                       # → GitHub Actions build + deploy automatique
echo "✅ publié : $slug  (en ligne dans ~1-2 min sur willie-leroux.fr/veille/$slug)"
