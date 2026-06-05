#!/usr/bin/env node
/**
 * verify-articles.mjs — vérification automatique des articles de veille générés.
 *
 * Trois axes (demande métier) + style :
 *   DATES     : pubDate / updatedDate présentes, parseables, cohérentes.
 *   SOURCES   : liens internes qui résolvent vraiment, liens externes bien formés,
 *               affirmations chiffrées / normatives sans source signalées.
 *   VÉRACITÉ  : claims (chiffres, normes, %, durées) listés pour relecture humaine.
 *   STYLE     : règles VOICE.md (longueur, tics IA, tiret cadratin, CTA).
 *
 * Usage :
 *   node scripts/verify-articles.mjs                 # toute la collection veille
 *   node scripts/verify-articles.mjs <fichier.md>    # un seul article (publish.sh)
 *
 * Code de sortie : 1 si au moins une ERREUR (casse potentielle / lien mort /
 * date absurde / catégorie invalide). Les AVERTISSEMENTS ne bloquent pas.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'src', 'content');
const VEILLE_DIR = join(CONTENT, 'veille');

// Catégories autorisées — doit rester aligné sur src/content/config.ts
const CATEGORIES = [
  'Réglementation',
  'Archivage & SAE',
  'Courrier & BPO',
  'Signature & confiance',
  'Secteur public',
];

// Pages statiques valides comme cible de lien interne
const STATIC_ROUTES = new Set([
  '/', '/a-propos', '/mentions-legales',
  '/expertises', '/secteurs', '/cas', '/veille', '/rss.xml',
]);

// Tics d'écriture générée (VOICE.md → formules à éviter)
const AI_TICS = [
  'dans un monde où', "à l'ère du numérique", 'il est important de noter',
  'en conclusion', 'force est de constater', 'de nos jours', 'incontournable',
  'révolutionnaire', 'à l’heure où', "n'hésitez pas",
];

// ---------- utilitaires ----------
const slugsIn = (dir) =>
  existsSync(dir)
    ? new Set(readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx')).map((f) => f.replace(/\.mdx?$/, '')))
    : new Set();

const VALID = {
  expertises: slugsIn(join(CONTENT, 'expertises')),
  secteurs: slugsIn(join(CONTENT, 'secteurs')),
  cas: slugsIn(join(CONTENT, 'cas')),
  veille: slugsIn(VEILLE_DIR),
};

function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: null, body: raw };
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const mm = line.match(/^([A-Za-zÀ-ÿ_]+):\s*(.*)$/);
    if (mm) fm[mm[1]] = mm[2].replace(/^["']|["']$/g, '').trim();
  }
  return { fm, body: m[2] };
}

function checkInternalLink(target, valid) {
  const path = target.split('#')[0].replace(/\/$/, '') || '/';
  if (STATIC_ROUTES.has(path) || STATIC_ROUTES.has(path + '/')) return true;
  const seg = path.split('/').filter(Boolean);
  if (seg.length === 2 && valid[seg[0]]) return valid[seg[0]].has(seg[1]);
  if (seg[0] === 'veille' && seg[1] === 'categorie') return true; // routes dérivées
  if (seg.length === 1 && ['expertises', 'secteurs', 'cas', 'veille'].includes(seg[0])) return true;
  return false;
}

// ---------- vérification d'un article ----------
function verify(file) {
  const raw = readFileSync(file, 'utf8');
  const name = basename(file);
  const { fm, body } = splitFrontmatter(raw);
  const errors = [];
  const warns = [];
  const claims = [];

  if (!fm) {
    errors.push('frontmatter introuvable (--- … ---)');
    return { name, errors, warns, claims };
  }

  // -- DATES --
  for (const champ of ['titre', 'description', 'categorie', 'pubDate']) {
    if (!fm[champ]) errors.push(`champ obligatoire manquant : ${champ}`);
  }
  if (fm.categorie && !CATEGORIES.includes(fm.categorie))
    errors.push(`catégorie invalide : « ${fm.categorie} »`);

  const today = new Date();
  const parseDate = (v) => {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  };
  if (fm.pubDate) {
    const d = parseDate(fm.pubDate);
    if (!d) errors.push(`pubDate non parseable : « ${fm.pubDate} »`);
    else {
      if (d.getFullYear() < 2020) errors.push(`pubDate suspecte (avant 2020) : ${fm.pubDate}`);
      const ahead = (d - today) / 86400000;
      if (ahead > 366) warns.push(`pubDate à plus d'un an dans le futur : ${fm.pubDate}`);
    }
  }
  if (fm.updatedDate) {
    const u = parseDate(fm.updatedDate);
    const p = parseDate(fm.pubDate);
    if (!u) errors.push(`updatedDate non parseable : « ${fm.updatedDate} »`);
    else if (p && u < p) errors.push('updatedDate antérieure à pubDate');
  }

  // -- SOURCES (liens) --
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  let hasCTA = false;
  while ((m = linkRe.exec(body))) {
    const target = m[2].trim();
    if (target.startsWith('http')) {
      if (!/^https?:\/\/[^\s)]+$/.test(target)) warns.push(`lien externe mal formé : ${target}`);
      if (target.includes('calendly.com')) hasCTA = true;
    } else if (target.startsWith('/')) {
      if (target.includes('#contact')) hasCTA = true;
      if (!checkInternalLink(target, VALID)) errors.push(`lien interne mort : ${target}`);
    } else if (target.startsWith('mailto:')) {
      // ok
    } else {
      warns.push(`lien relatif ambigu (préférer /chemin) : ${target}`);
    }
  }
  if (!hasCTA) warns.push('aucun CTA détecté (lien /#contact ou Calendly attendu)');

  // -- VÉRACITÉ (claims à relire) --
  const sentences = body.replace(/\n+/g, ' ').split(/(?<=[.!?])\s+/);
  const claimRe = /(NF\s?\d{3}|eIDAS|RGPD|ISO\s?\d{4,5}|HDS|\b\d+\s?%|\b\d[\d  .]*\s*(?:ans?|jours?|mois|courriers?|plis?|Go|To|€|euros?|collaborateurs?)\b)/i;
  for (const s of sentences) {
    const c = s.match(claimRe);
    if (c) {
      const hasSource = /\]\(/.test(s) || /https?:\/\//.test(s);
      claims.push({ text: s.trim().slice(0, 140), token: c[1].trim(), sourced: hasSource });
    }
  }

  // -- STYLE (VOICE.md) --
  const wc = body.replace(/\[[^\]]*\]\([^)]*\)/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  if (wc < 150) errors.push(`corps trop court (${wc} mots) — article incomplet ?`);
  else if (wc < 280 || wc > 480) warns.push(`longueur hors cible 300-450 mots : ${wc}`);
  if (/—|--/.test(body)) warns.push('tiret cadratin (—) ou double tiret détecté (VOICE : interdits)');
  const low = body.toLowerCase();
  for (const t of AI_TICS) if (low.includes(t)) warns.push(`tic d'écriture IA : « ${t} »`);
  if (/^#\s/m.test(body)) warns.push('titre H1 (#) dans le corps (le gabarit l’ajoute déjà)');

  return { name, errors, warns, claims, wc };
}

// ---------- exécution ----------
const arg = process.argv[2];
let files;
if (arg) {
  files = [resolve(arg)];
} else {
  files = readdirSync(VEILLE_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => join(VEILLE_DIR, f));
}

let totalErrors = 0;
let totalWarns = 0;
const RED = '\x1b[31m', YEL = '\x1b[33m', GRN = '\x1b[32m', CYA = '\x1b[36m', DIM = '\x1b[2m', RST = '\x1b[0m';

console.log(`\n🔎 Vérification de ${files.length} article(s) de veille\n`);

for (const f of files) {
  const r = verify(f);
  const unsourced = r.claims.filter((c) => !c.sourced);
  const status = r.errors.length ? `${RED}✖${RST}` : r.warns.length ? `${YEL}▲${RST}` : `${GRN}✔${RST}`;
  console.log(`${status} ${r.name}  ${DIM}(${r.wc ?? '?'} mots)${RST}`);

  for (const e of r.errors) console.log(`   ${RED}ERREUR${RST}  ${e}`);
  for (const w of r.warns) console.log(`   ${YEL}WARN  ${RST}  ${w}`);
  if (unsourced.length) {
    console.log(`   ${CYA}VÉRACITÉ${RST} ${unsourced.length} affirmation(s) chiffrée/normative sans source — à relire :`);
    for (const c of unsourced.slice(0, 6)) console.log(`     ${DIM}· [${c.token}] ${c.text}…${RST}`);
  }
  totalErrors += r.errors.length;
  totalWarns += r.warns.length;
}

console.log(
  `\n${totalErrors ? RED : GRN}Résumé : ${totalErrors} erreur(s), ${totalWarns} avertissement(s).${RST}`
);
console.log(
  `${DIM}Véracité : les affirmations chiffrées/normatives sont signalées pour relecture humaine ; ` +
  `aucun outil ne peut valider seul un fait métier.${RST}\n`
);

process.exit(totalErrors ? 1 : 0);
