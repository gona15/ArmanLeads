// Per-lead click tracker for cold-email links, plus normal static file serving.
//
// A lead's email contains a link like armanleads.com/r/l4fe0puo instead of
// a plain armanleads.com link. This logs the click (which lead, when) and
// redirects to the real homepage in the same response — the visitor never
// sees anything but a normal link. Everything else falls through to the
// static site exactly as before.
//
// Uses the public anon key on purpose, not the service role key: this file
// ships in a public repo and runs on a public route, so it only ever needs
// permission to INSERT into link_clicks — nothing more. The Supabase RLS
// policy on that table grants exactly that and nothing else, so even a
// fully leaked copy of this file can't read, edit, or delete anything.
const SUPABASE_URL = "https://tlxbfaloqcprtquryqsp.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRseGJmYWxvcWNwcnRxdXJ5cXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2Njg2OTMsImV4cCI6MjA5OTI0NDY5M30.Pe4omG7U1bsDIWyxWsP_yGvym0Z0ptBSSK3t91nD8uU";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/r\/([^/]+)\/?$/);

    if (match) {
      const id = decodeURIComponent(match[1]);
      ctx.waitUntil(
        fetch(`${SUPABASE_URL}/rest/v1/link_clicks`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lead_id: id }),
        }).catch(() => {})
      );
      return Response.redirect("https://armanleads.com/", 302);
    }

    return env.ASSETS.fetch(request);
  },
};
