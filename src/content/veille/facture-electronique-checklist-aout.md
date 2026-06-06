---
titre: "Facture électronique : votre checklist conformité avant le 1er septembre"
description: "J-10 : dernière ligne droite avant obligation. 5 points à vérifier, chronométrés pour ceux qui démarrent maintenant."
categorie: "Archivage & SAE"
tags: ["facturation", "septembre 2026", "EDI", "archivage", "checklist"]
pubDate: 2026-08-22
draft: true
---

## Le countdown final

Vous êtes à J-10. Obligation reçoit facture électronique (niveau 1 minimum : PDF en format structuré, email, archivage probant documenté). Zéro délai de grâce, zéro exemption. Voici checklist survie pour ceux qui partent tard.

## 1. Inventaire partenaires (2 heures)

Exportez liste fournisseurs avec volumes. Qui vous envoie déjà factures PDF ? Qui envoie papier ? Qui peut passer EDI en 10 jours ?

Classez : faciles (85 % volume, déjà en EDI ou email PDF) / moyens (conversion rapide) / difficiles (papier uniquement, changement système).

Priorisez faciles. Contactez moyens aujourd'hui pour test dimanche. Acceptez difficiles en papier quelques jours encore (régulateur ne contrôle pas jour 1).

## 2. Archivage probant : test (1 jour)

Vous devez archiver factures 6 ans (NF 461). Pas d'email en folder Outlook : données perdent intégrité 2 ans après.

Test SAE : achetez licence essai (Everteam, Doxis, OpenText, Docuflow). Importez 100 factures. Vérifiez : checksum calculés, droits accès posables, export possible sans perte format. Go/no-go une semaine avant.

## 3. ERP + EDI : intégration basique (3 jours)

ERP accepte XML/UBL ? Testez import facture réelle : 1) Atterrit sans erreur, 2) Champs extraits (SIRET, montant, références), 3) Comptabilité reçoit débit automatique.

Schema EDI varie par pays (FR vs DE vs BE). Validez against test partenaire 3 jours avant lancement.

## 4. Équipe réception : formation (1 jour)

Nouveaux workflows : certains fournisseurs enverront EDI (pas d'intervention), d'autres resteront PDF (triage manuel). Service facture doit savoir discriminer, relancer format EDI sur retardataires.

30 minutes d'atelier : démo EDI reçu, démo PDF non conforme, escalade process. Documentez décision pour audit.

## 5. Audit traces (1 demi-jour)

Régulateur contrôlera : preuves réception facture (date, horodatage), intégrité conservation, droits d'accès. Documentez :
- Logs de réception (statut par fournisseur).
- Checksums archivage (un fichier exemple).
- Admin SAE responsable nommée.

Une page suffira pour dire « nous avons ».

## J-1 : vérification stress

Dimanche 31 août : importez 50 factures EDI variées (3 formats différents minimum). Laissez processus rouler automatiquement. Aucune intervalle manuelle ? Go lundi.

Besoin accompagnement technique dernière minute ? [Calendrier réservation](/#contact) 48h avant J.

À lundi !
