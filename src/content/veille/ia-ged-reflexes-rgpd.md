---
titre: "IA dans la GED : les 3 réflexes RGPD à adopter"
description: "CNIL a finalisé recommandations IA en juin. GED + modèles de langage = responsabilité partagée complexe. Comment s'y préparer ?"
categorie: "Réglementation"
tags: ["IA", "RGPD", "GED", "CNIL", "traitement données"]
pubDate: 2026-07-25
draft: true
---

## Les nouvelles règles CNIL (juin 2026)

Après 18 mois de consultation, la CNIL a publié ses recommandations IA (juin 2026). Résumé crucial : utiliser IA sur données personnelles crée obligations supplémentaires. Votre GED qui utilise OCR + modèle langage pour extraire infos facture ? C'est du traitement documentaire, mais celui-ci passe données client à tiers (OpenAI, Anthropic, Google, locaux propriétaires).

Vous êtes responsable conjointe avec prestataire. Absence accord écrit clair = infraction Article 28 RGPD.

## Réflexe 1 : Inventorier les flux IA

Listez chaque point où données quittent votre GED pour un modèle :
- Reconnaissance texte (OCR sur scan).
- Classification automatique (facture fournisseur vs client).
- Extraction entités (SIRET, montant, date).
- Résumé content (métadonnées).

Chaque flux = traitement. Chaque traitement = contrat data processor avec prestataire. Zéro contrat = risque amende CNIL 20 000 à 50 000 euros.

## Réflexe 2 : Pseudonymiser avant envoi modèle

Données envoyées au modèle IA doivent être pseudonymisées (nom client → hash_789456). Raison : si prestataire subit incident sécurité, vos données client ne doivent pas être réidentifiables directement.

Cas concret : GED envoie facture anonymisée à modèle OCR (pas de numéro client, nom remplacé par variable). Modèle extrait montant, date, poste comptable. Pseudo-données reviennent en GED, re-linkage interne local.

Coût : 2 à 3 jours développement pour pipeline pseudonymisation. Gain : risque exposition réduit drastiquement.

## Réflexe 3 : Documenter responsabilité partagée

Contrat data processor obligatoire. Doit spécifier :
- Nature traitement (OCR, classification, extraction).
- Durée retention modèle (logs, Fine-tuning).
- Localisation serveurs (EU ou extra-EU).
- Sous-traitants modèle (OpenAI utilise serveurs partenaires, disclosure requis).
- Droits audit CNIL.

CNIL a publié template contrat libre. Ne partez pas de zéro.

## Avant fin août

Faites audit : 1) Qui utilise IA en chaîne documents ? 2) Contrats en place ? 3) Données pseudonymisées ? 4) Logs retention définis ?

Non conformité expose : amende 20–50 k€, suspension service, demande destruction données. Coûts cachés : audit interne, incident comms, client perte confiance.

Besoin expertise IA + GED conformité ? [Contactez-nous](/#contact) pour audit spécifique.
