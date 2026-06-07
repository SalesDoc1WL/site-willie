import { defineCollection, z } from 'astro:content';

// Valeurs contrôlées (taxonomie) — alignées sur les slugs de fichiers
export const EXPERTISE_SLUGS = [
  'bpo-courrier-entrant',
  'numerisation-nf544',
  'archivage-electronique-nf461',
  'recommande-electronique-eidas',
  'ged-documents-vivants',
  'editique-confiance',
] as const;

export const SECTEUR_SLUGS = [
  'banque',
  'secteur-public',
  'assurance',
  'protection-sociale',
  'courtage',
  'collectivites',
] as const;

export const VEILLE_CATEGORIES = [
  'Réglementation',
  'Archivage & SAE',
  'Courrier & BPO',
  'Signature & confiance',
  'Secteur public',
] as const;

const expertises = defineCollection({
  type: 'content',
  schema: z.object({
    titre: z.string(),
    norme: z.string(),
    resume: z.string(),
    ordre: z.number().default(99),
    secteursLies: z.array(z.enum(SECTEUR_SLUGS)).default([]),
    seoDescription: z.string().optional(),
  }),
});

const secteurs = defineCollection({
  type: 'content',
  schema: z.object({
    titre: z.string(),
    resume: z.string(),
    ordre: z.number().default(99),
    expertisesPertinentes: z.array(z.enum(EXPERTISE_SLUGS)).default([]),
    seoDescription: z.string().optional(),
  }),
});

const veille = defineCollection({
  type: 'content',
  schema: z.object({
    titre: z.string(),
    description: z.string(),
    categorie: z.enum(VEILLE_CATEGORIES),
    tags: z.array(z.string()).default([]),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { expertises, secteurs, veille };
