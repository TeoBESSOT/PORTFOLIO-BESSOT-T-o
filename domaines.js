const groupDefs = [
  {key:"qualite", label:"Qualité", cls:"qualite", icon:"✓"},
  {key:"logistique", label:"Logistique", cls:"logistique", icon:"⇄"},
  {key:"organisation", label:"Organisation", cls:"organisation", icon:"⌘"}
];
document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("domainGroups");
  const status = document.getElementById("status");
  const client = await window.supabaseReady;
  let rows = [];
  if (client) {
    const {data, error} = await client.from("specialites").select("slug,categorie,titre");
    if (!error) rows = data || [];
    else status.textContent = "Impossible de charger les fiches : " + error.message;
    const {data:{session}} = await client.auth.getSession();
    document.getElementById("loginLink").hidden = !!session;
    const logout = document.getElementById("logoutBtn");
    logout.hidden = !session;
    logout.addEventListener("click", async () => { await client.auth.signOut(); location.reload(); });
  } else status.textContent = "Le site doit encore être configuré avec les clés Supabase.";
  root.innerHTML = groupDefs.map(g => {
    const cards = Array.from({length:9}, (_,i) => {
      const slug = `${g.key}-${i+1}`;
      const row = rows.find(r => r.slug === slug);
      const label = row && row.titre ? row.titre : `Spécialité ${i+1} — à compléter`;
      return `<a class="bubble-card ${g.cls}" href="fiche.html?d=${slug}"><span class="bubble-icon">${g.icon}</span><span class="bubble-category">${g.label.toUpperCase()}</span><strong>${escapeHtml(label)}</strong><span class="bubble-arrow">↗</span></a>`;
    }).join("");
    return `<section class="domain-category"><h2>${g.label}</h2><div class="bubble-grid">${cards}</div></section>`;
  }).join("");
});
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}