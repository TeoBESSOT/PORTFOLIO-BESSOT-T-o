const domaines = {"qualite": {"title": "Démarche qualité", "cat": "QUALITÉ", "desc": "Définir une politique qualité, répondre aux exigences et améliorer la satisfaction des parties intéressées.", "examples": "ISO 9001 · Politique qualité · SMQ"}, "audit": {"title": "Audit qualité", "cat": "QUALITÉ", "desc": "Préparer et réaliser un audit, recueillir des preuves, identifier les écarts et formuler des constats.", "examples": "Plan d'audit · Questions · Rapport d'audit"}, "amelioration": {"title": "Amélioration continue", "cat": "QUALITÉ", "desc": "Analyser les dysfonctionnements et mettre en place des actions pour améliorer les résultats.", "examples": "PDCA · Ishikawa · 5 pourquoi"}, "stocks": {"title": "Gestion des stocks", "cat": "LOGISTIQUE", "desc": "Suivre les niveaux de stock et déterminer les besoins afin d'éviter les ruptures et les surstocks.", "examples": "Stock de sécurité · Rotation · Inventaire"}, "appro": {"title": "Approvisionnement", "cat": "LOGISTIQUE", "desc": "Définir les besoins et organiser les commandes pour assurer la disponibilité des matières et produits.", "examples": "MRP · Besoins nets · Délais"}, "flux": {"title": "Gestion des flux", "cat": "LOGISTIQUE", "desc": "Organiser la circulation des produits et des informations tout au long de la chaîne logistique.", "examples": "Flux physiques · Traçabilité · GS1"}, "processus": {"title": "Gestion des processus", "cat": "ORGANISATION", "desc": "Identifier les activités, leurs interactions, leurs pilotes et leurs objectifs.", "examples": "Cartographie · SIPOC · Parties intéressées"}, "projet": {"title": "Gestion de projet", "cat": "ORGANISATION", "desc": "Planifier les étapes, répartir les responsabilités et suivre l'avancement d'un projet.", "examples": "Objectifs · Planning · Coordination"}, "performance": {"title": "Pilotage de la performance", "cat": "ORGANISATION", "desc": "Mesurer les résultats à l'aide d'indicateurs et proposer des actions adaptées.", "examples": "KPI · Tableau de bord · TRS"}};

const params = new URLSearchParams(location.search);
const key = params.get('d');
const item = domaines[key];
const root = document.getElementById('detail');
if (!item) {
  root.innerHTML = '<p>Fiche introuvable. <a href="domaines.html">Retour aux 9 domaines</a>.</p>';
} else {
  document.title = item.title + ' | QLIO';
  root.innerHTML = `
    <p class="eyebrow">${item.cat}</p>
    <h1>${item.title}</h1>
    <p class="lead narrow">${item.desc}</p>
    <section class="detail-panel">
      <h2>Notions et outils associés</h2><p>${item.examples}</p>
      <h2>Ce que je sais faire</h2>
      <ul><li>Expliquer les principes et les objectifs de ce domaine.</li><li>Mobiliser les méthodes et outils adaptés à une situation.</li><li>Analyser les résultats et proposer des pistes d'amélioration.</li></ul>
      <h2>Mes images et illustrations</h2>
      <p class="muted">Ajoute des photos de tes projets, schémas, tableaux ou captures d'écran pour illustrer cette spécialité.</p>
      <div class="image-tools"><label class="button primary upload-button" for="imagePicker">＋ Ajouter une image depuis mon ordinateur</label><input id="imagePicker" type="file" accept="image/*" multiple hidden>
      <input id="imageUrl" class="url-input" type="url" placeholder="Ou colle l'adresse d'une image (https://...)"><button id="addUrl" class="button secondary">Ajouter l'URL</button></div>
      <div id="gallery" class="image-gallery"></div>
      <p class="image-help">Aperçu privé : les images choisies sont conservées dans ce navigateur. Pour les rendre visibles à tous sur ton site GitHub, ajoute les fichiers dans le dossier <b>images/</b> du dépôt puis utilise leurs adresses dans le champ URL.</p>
      <h2>Exemple de réalisation personnelle</h2><p class="muted">À compléter avec un exercice, un projet ou une situation rencontrée pendant la formation.</p>
    </section><a class="text-link" href="domaines.html">← Retour aux 9 bulles</a>`;
  const gallery = document.getElementById('gallery');
  const storageKey = 'qlio-gallery-' + key;
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch(e) {}
  function render() {
    gallery.innerHTML = '';
    saved.forEach((src, i) => {
      const figure = document.createElement('figure');
      const img = document.createElement('img'); img.src = src; img.alt = 'Illustration ' + (i+1);
      const remove = document.createElement('button'); remove.className = 'remove-image'; remove.textContent = '×'; remove.title = 'Supprimer cette image';
      remove.addEventListener('click', () => { saved.splice(i,1); persist(); render(); });
      figure.append(img, remove); gallery.append(figure);
    });
  }
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); }
    catch(e) { alert("Le stockage du navigateur est plein. Essaie avec des images plus légères."); }
  }
  document.getElementById('imagePicker').addEventListener('change', async (event) => {
    for (const file of event.target.files) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 2 * 1024 * 1024) { alert(file.name + ' dépasse 2 Mo. Réduis sa taille avant de l’ajouter.'); continue; }
      const reader = new FileReader();
      reader.onload = () => { saved.push(reader.result); persist(); render(); };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  });
  document.getElementById('addUrl').addEventListener('click', () => {
    const field = document.getElementById('imageUrl');
    const url = field.value.trim();
    if (!/^https?:\/\//i.test(url)) { alert('Entre une adresse d’image commençant par https:// ou http://'); return; }
    saved.push(url); persist(); render(); field.value = '';
  });
  render();
}
