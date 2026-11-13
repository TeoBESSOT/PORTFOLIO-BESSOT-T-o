const params = new URLSearchParams(location.search);
const slug = params.get("d");
const category = slug ? slug.split("-")[0] : "";
const categoryNames = {qualite:"Qualité",logistique:"Logistique",organisation:"Organisation"};
const root = document.getElementById("detail");
const esc = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
document.addEventListener("DOMContentLoaded", async () => {
  const client = await window.supabaseReady;
  if (!client) { root.innerHTML = '<h1>Configuration nécessaire</h1><p>Complète supabase-config.js avec ton URL et ta clé publique Supabase.</p>'; return; }
  if (!/^(qualite|logistique|organisation)-[1-9]$/.test(slug || "")) { root.innerHTML = '<p>Fiche introuvable. <a href="domaines.html">Retour aux spécialités</a>.</p>'; return; }
  const {data:{session}} = await client.auth.getSession();
  const login = document.getElementById("loginLink"), logout = document.getElementById("logoutBtn");
  login.hidden = !!session; logout.hidden = !session;
  logout.addEventListener("click", async()=>{await client.auth.signOut();location.reload();});
  let {data:row,error} = await client.from("specialites").select("*").eq("slug",slug).maybeSingle();
  if (error) { root.innerHTML = `<p>Erreur de lecture : ${esc(error.message)}</p>`; return; }
  if (!row) row = {slug,categorie:category,titre:"",contenu:"",image_urls:[]};
  const title = row.titre || "Spécialité à compléter";
  const images = Array.isArray(row.image_urls) ? row.image_urls : [];
  root.innerHTML = `<p class="eyebrow">${categoryNames[category].toUpperCase()}</p><h1>${esc(title)}</h1>
  <section class="detail-panel"><div id="viewMode"><h2>Présentation</h2><p id="viewText" class="muted">${row.contenu ? esc(row.contenu).replace(/\n/g,"<br>") : "Aucune information n'a encore été ajoutée."}</p><h2>Mes images</h2><div id="gallery" class="image-gallery"></div></div>
  <section id="editMode" hidden><h2>Modifier cette spécialité</h2><label for="editTitle">Titre de la spécialité</label><input id="editTitle" class="url-input" style="width:100%;margin:8px 0 18px" maxlength="120" value="${esc(row.titre)}" placeholder="Écris ton titre ici"><label for="editContent">Informations et description</label><textarea id="editContent" rows="9" class="url-input" style="width:100%;margin:8px 0 18px" placeholder="Écris tes informations ici">${esc(row.contenu)}</textarea>
  <h2>Ajouter des images</h2><input id="imageFiles" type="file" accept="image/jpeg,image/png,image/webp" multiple><p class="image-help">Formats JPEG, PNG ou WebP. 5 Mo maximum par image.</p><button class="button primary" id="saveBtn">Enregistrer les modifications</button><p id="saveStatus" class="muted" role="status"></p></section>
  <div id="adminActions" style="margin-top:24px"></div></section><a class="text-link" href="domaines.html">← Retour aux spécialités</a>`;
  const gallery = document.getElementById("gallery");
  function renderGallery(urls){gallery.innerHTML=urls.map(u=>`<figure><img src="${esc(u)}" alt="Image de la spécialité"></figure>`).join("");}
  renderGallery(images);
  if (session) {
    document.getElementById("editMode").hidden=false;
    document.getElementById("adminActions").innerHTML='<p class="edit-note">Tu es connecté : tu peux modifier cette fiche.</p>';
    document.getElementById("saveBtn").addEventListener("click", async()=>{
      const status=document.getElementById("saveStatus"); const btn=document.getElementById("saveBtn");
      btn.disabled=true; status.textContent="Enregistrement…";
      const title=document.getElementById("editTitle").value.trim();
      const content=document.getElementById("editContent").value.trim();
      let urls=Array.isArray(row.image_urls)?[...row.image_urls]:[];
      const selected=[...document.getElementById("imageFiles").files];
      for(const file of selected){
        if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>5*1024*1024){status.textContent="Image refusée : format non autorisé ou fichier supérieur à 5 Mo.";btn.disabled=false;return;}
        const path=`${slug}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;
        const {error:uploadError}=await client.storage.from("portfolio-images").upload(path,file,{upsert:false,contentType:file.type});
        if(uploadError){status.textContent="Erreur d'envoi d'image : "+uploadError.message;btn.disabled=false;return;}
        const {data:publicData}=client.storage.from("portfolio-images").getPublicUrl(path);
        urls.push(publicData.publicUrl);
      }
      const payload={slug,categorie:category,titre:title,contenu:content,image_urls:urls,updated_at:new Date().toISOString()};
      const {error:saveError}=await client.from("specialites").upsert(payload,{onConflict:"slug"});
      if(saveError){status.textContent="Erreur d'enregistrement : "+saveError.message;btn.disabled=false;return;}
      row=payload; document.title=(title||"Spécialité")+" | QLIO";
      root.querySelector("h1").textContent=title||"Spécialité à compléter";
      document.getElementById("viewText").textContent=content||"Aucune information n'a encore été ajoutée.";
      renderGallery(urls); status.textContent="Modifications enregistrées."; document.getElementById("imageFiles").value=""; btn.disabled=false;
    });
  } else {
    document.getElementById("adminActions").innerHTML='<a class="button primary" href="login.html">Se connecter pour modifier</a>';
  }
});