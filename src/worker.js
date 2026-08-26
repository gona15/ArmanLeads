// Per-lead click tracker for cold-email links, market page rendering, plus
// normal static file serving.
//
// A lead's email contains a link like armanleads.com/r/l4fe0puo instead of
// a plain armanleads.com link. This logs the click (which lead, when) and
// redirects to the market page for that lead's city in the same response —
// the visitor never sees anything but a normal link. Everything else falls
// through to the static site exactly as before.
//
// Uses the public anon key on purpose, not the service role key: this file
// ships in a public repo and runs on a public route, so it only ever needs
// permission to INSERT into link_clicks — nothing more. The Supabase RLS
// policy on that table grants exactly that and nothing else, so even a
// fully leaked copy of this file can't read, edit, or delete anything.
//
// The city lookup below reads CRM state server-side only, and only ever
// yields a redirect target. If a privileged key is ever bound to this
// worker (env.SUPABASE_READ_KEY), the lookup uses it instead of the anon
// key; nothing about the key ever reaches the browser either way.
import { marketBySlug, pathForCity, renderMarket } from "./markets.js";

const SUPABASE_URL = "https://tlxbfaloqcprtquryqsp.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRseGJmYWxvcWNwcnRxdXJ5cXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2Njg2OTMsImV4cCI6MjA5OTI0NDY5M30.Pe4omG7U1bsDIWyxWsP_yGvym0Z0ptBSSK3t91nD8uU";
const STATE_ROW_ID = "main";

// Lead ids are short generated slugs (e.g. "l4fe0puo"). Anything else is a
// typo or a probe, and never reaches Supabase.
const LEAD_ID = /^[A-Za-z0-9_-]{1,64}$/;

// Drafts write the link bare, mid-sentence: "...have a look at
// armanleads.com/r/l4fe0puo." Some mail clients pull the trailing period or
// comma into the link, so the request arrives as /r/l4fe0puo. — a real id
// wearing punctuation. Trim it rather than treat those clicks as garbage;
// emails already sitting in drafts are written that way and can't be
// retro-edited.
const trimPunctuation = (s) => s.replace(/[.,;:!?)\]}'"]+$/, "");

// The CRM keeps everything in one JSON row, so resolving a city means pulling
// the whole ~1MB of state — drafts, notes, the lot. Doing that on every click
// would put a second of latency in front of the redirect and ship the entire
// prospect list across the wire each time, so the response is reduced to an
// id -> path map straight away and that map is what's held, briefly. A miss
// forces one refresh, so a lead created and emailed minutes ago still lands
// on the right page.
const CITY_CACHE_MS = 5 * 60 * 1000;
/** @type {{at: number, paths: Map<string, string>}} */
let cityCache = { at: 0, paths: new Map() };

async function loadCityPaths(env) {
  const key = env.SUPABASE_READ_KEY || SUPABASE_ANON_KEY;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/armanleads_state?id=eq.${STATE_ROW_ID}&select=data`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) throw new Error(`state read failed: ${res.status}`);
  const rows = await res.json();
  const leads = rows?.[0]?.data?.leads;
  if (!Array.isArray(leads)) throw new Error("state read returned no leads");
  const paths = new Map();
  for (const l of leads) if (l && l.id) paths.set(String(l.id), pathForCity(l.city));
  cityCache = { at: Date.now(), paths };
  return paths;
}

/**
 * Looks up which market page a lead belongs on. Runs entirely server-side;
 * no lead field other than the resulting path ever leaves this function.
 * @returns {Promise<string>} A path — "/" if the lead or city is unknown.
 */
async function marketPathForLead(id, env) {
  try {
    const fresh = Date.now() - cityCache.at < CITY_CACHE_MS;
    let paths = fresh ? cityCache.paths : await loadCityPaths(env);
    if (!paths.has(id) && fresh) paths = await loadCityPaths(env);
    return paths.get(id) || "/";
  } catch {
    // A lookup that fails must never cost the click: send them to the
    // homepage, which is written for every market.
    return "/";
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const redirect = (path) => Response.redirect(new URL(path, url.origin).toString(), 302);

    const match = url.pathname.match(/^\/r\/([^/]+)\/?$/);
    if (match) {
      const id = trimPunctuation(decodeURIComponent(match[1]));
      if (!LEAD_ID.test(id)) return redirect("/");
      // Optional ?s=stage (initial/fu1/fu2/fu3) identifies which specific
      // email this link was in, not just which lead. Encoded into the same
      // lead_id text column as "id:stage" rather than a new column, since
      // this worker only has anon INSERT access - no schema/DDL access to
      // add a real column. Links with no ?s= (all history before this
      // change, and anything hand-typed without it) still log as a plain
      // id, same as always - normalizeClicks() on the CRM side treats that
      // as "clicked, stage unknown" rather than dropping it.
      const stage = trimPunctuation(url.searchParams.get("s") || "");
      const loggedId = stage ? `${id}:${stage}` : id;
      ctx.waitUntil(
        fetch(`${SUPABASE_URL}/rest/v1/link_clicks`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lead_id: loggedId }),
        }).catch(() => {})
      );
      // Emails already sent point at /r/{id} with no city in the URL, so
      // the city has to be resolved here for old links to land on the right
      // page without anything being re-sent.
      return redirect(await marketPathForLead(id, env));
    }

    const marketMatch = url.pathname.match(/^\/markets\/([^/]+)\/?$/);
    if (marketMatch) {
      const market = marketBySlug(decodeURIComponent(marketMatch[1]));
      if (!market) return redirect("/");
      const page = await env.ASSETS.fetch(new URL("/index.html", url.origin));
      if (!page.ok) return page;
      const html = renderMarket(await page.text(), market, url.origin);
      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=0, must-revalidate",
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
