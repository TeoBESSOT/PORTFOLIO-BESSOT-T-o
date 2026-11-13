PORTFOLIO QLIO - VERSION CONNECTEE A SUPABASE

FICHIERS AJOUTES / MODIFIES
- supabase-config.js : URL et clé publique de ton projet.
- supabase-client.js : initialise le client Supabase.
- login.html / auth.js : connexion par e-mail et mot de passe.
- domaines.html / domaines.js : affiche 27 bulles (9 par catégorie).
- fiche.html / fiche.js : lecture publique et édition après connexion.
- style.css : styles complémentaires.

AVANT PUBLICATION
1. Ouvre supabase-config.js.
2. Remplace COLLE_ICI_TON_PROJECT_URL par ton Project URL.
3. Remplace COLLE_ICI_TA_PUBLISHABLE_KEY par ta clé publique (sb_publishable_...).
4. Ne mets JAMAIS une clé service_role ou secrète dans le site.
5. Vérifie que les règles SQL/RLS déjà créées utilisent le bon User UID.
6. Dans Supabase Authentication > URL Configuration, ajoute l'URL GitHub Pages aux Redirect URLs.
7. Téléverse TOUS les fichiers du dossier à la racine de ton dépôt GitHub (remplace les anciens fichiers).
8. Attends le déploiement GitHub Pages puis teste login.html.

UTILISATION
- Les 27 fiches sont vierges. Les libellés temporaires "Spécialité 1 — à compléter" sont des repères, pas du contenu prérempli.
- Visiteur : peut consulter les fiches et images publiques.
- Administrateur connecté : peut définir le titre, le texte et téléverser des images.
- Les photos sont stockées dans le bucket public portfolio-images.
- Le compte administrateur doit déjà exister dans Supabase Authentication.
- Pour fermer les inscriptions, garde les inscriptions publiques désactivées dans Supabase.

IMPORTANT
- Ce code suppose que la table public.specialites possède : slug, categorie, titre, contenu, image_urls, updated_at.
- Les politiques RLS doivent autoriser SELECT public et INSERT/UPDATE/DELETE uniquement à ton User UID.
- Le bucket doit s'appeler exactement portfolio-images et être public pour l'affichage des photos.
- Le stockage doit avoir les politiques d'écriture uniquement pour ton User UID.
- Une clé publique est conçue pour être exposée côté navigateur ; la sécurité repose sur RLS et les politiques Storage.
