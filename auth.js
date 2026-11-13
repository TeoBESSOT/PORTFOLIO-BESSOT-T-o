document.addEventListener("DOMContentLoaded", async () => {
  const client = await window.supabaseReady;
  const form = document.getElementById("loginForm");
  if (!form) return;
  const message = document.getElementById("message");
  if (!client) { message.textContent = "Configure d'abord supabase-config.js."; return; }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "Connexion en cours…";
    const { error } = await client.auth.signInWithPassword({
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value
    });
    if (error) { message.textContent = "Connexion impossible : " + error.message; return; }
    location.href = "domaines.html";
  });
});