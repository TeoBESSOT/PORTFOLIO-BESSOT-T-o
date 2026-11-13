// Client Supabase partagé par les pages du portfolio.
(() => {
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("COLLE_ICI") || key.includes("COLLE_ICI")) {
    console.warn("Configure supabase-config.js avec l'URL et la clé publique Supabase.");
    window.supabaseReady = Promise.resolve(null);
    return;
  }
  window.supabaseReady = Promise.resolve(
    window.supabase.createClient(url, key)
  );
})();
