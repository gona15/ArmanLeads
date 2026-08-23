// Multi-market configuration and server-side page rendering.
//
// The site is one hand-written index.html. Market pages (/markets/lincoln-ne
// and friends) are NOT copies of it: the worker fetches that same asset and
// swaps a small set of marked slots before returning it. Every rule, class,
// style and script stays byte-identical, so a market page can never visually
// drift away from the homepage.
//
// A slot is any element carrying data-mkt="<name>" in index.html. Its inner
// HTML on disk is the homepage (multi-market) wording; the copy below is what
// replaces it on a given market's page. Adding a fourth city means adding one
// entry to MARKETS — no new page, no new component, no CSS.

/**
 * @typedef {Object} Market
 * @property {string} slug        URL segment under /markets/.
 * @property {string} crmCity     Exact value stored on CRM leads (data.leads[].city).
 * @property {string} city        Display name.
 * @property {string} state       Full state name.
 * @property {string} title       <title> for this market's page.
 * @property {string} description Meta / OG description.
 * @property {string} ogTitle     OG + Twitter title.
 * @property {string} imageAlt    og:image:alt.
 * @property {string} cityPlaceholder Placeholder for the "City" form field.
 * @property {string[]} nearby    Nearby places named in the service-area answer.
 * @property {Record<string, string>} copy  Slot name -> replacement inner HTML.
 */

const OFFER =
  "The first 30 days are free: you pay only your own Meta ad spend, usually $300 to $500, billed by Meta straight to your card. After 30 days, if it is working, it is $697 a month, month-to-month, with no contract.";

/** Shared wording so a claim can never drift between markets. @type {string} */
const EXCLUSIVITY = "One practice per ZIP, with a deliberately limited client roster.";

/** @type {Market[]} */
export const MARKETS = [
  {
    slug: "des-moines-ia",
    crmCity: "Des Moines, IA",
    city: "Des Moines",
    state: "Iowa",
    title: "Des Moines Dental Marketing &amp; Meta Ads | ArmanLeads",
    description:
      "Meta ads that put new patients in the chairs of independent dental practices in Des Moines, Iowa. One practice per ZIP. The first 30 days are free. Then $697/mo, only if it's working.",
    ogTitle: "Des Moines dentists: new patients in your chairs, before you pay me a cent",
    imageAlt: "ArmanLeads, Meta ads for Des Moines dental practices",
    cityPlaceholder: "Des Moines",
    nearby: ["West Des Moines", "Ankeny", "Urbandale", "Johnston"],
    copy: {
      "masthead-geo": "For <b>Des Moines dentists</b>",
      "hero-eyebrow-geo": "For independent dental practices in Des Moines",
      "hero-sub":
        "I run new-patient ads for independent dental practices in Des Moines, one practice per ZIP. For the first 30 days you pay nothing but the ad spend itself. If new patients show up, we keep going at <strong>$697 a month</strong>. If they don't, we stop, and you're out nothing but a month of ad budget you'd have spent anyway.",
      "one-body-geo":
        "I'm not an agency. I take one practice per ZIP in Des Moines, and I work it until the ads are paying for themselves several times over. Then I take one more. <strong>I'd rather be the only person watching your numbers than one of six people sort of watching them.</strong>",
      "letter-geo":
        "I started in Des Moines because Iowa is independent-heavy, the corporate chains are pushing in fast, and one solo dentist with good ads can hold their ZIP for years. The only honest way to earn a market is to work 30 days for free, until I've actually proven I can do what I'm saying. If it works, we keep going. If it doesn't, you didn't lose anything you wouldn't have spent anyway.",
      "letter-geo-2":
        "Des Moines is where this started. I've since added Cedar Rapids and Lincoln the same way: a small number of independent dental markets, researched carefully, one practice per ZIP in each.",
      "obj-geo-q": "\"Why dentistry, and why Des Moines?\"",
      "obj-geo-a":
        "A few reasons. New patients are worth a lot over the life of the relationship, the demand is tied to one geography so ad clicks actually turn into local patients, and independent practices are getting out-spent on Google by the DSO chains pushing into Iowa. It's a niche where one person on one practice can still win. Des Moines itself is mid-sized, has a strong independent dental scene, draws fewer big-spend agencies than Austin or Miami, and the dentists here talk to each other. Do good work for one practice and the next few find me.",
      "faq-areas":
        "Des Moines, Iowa, including West Des Moines, Ankeny, Urbandale, and Johnston. Selected ZIPs are open right now. One practice per ZIP, so each area is exclusive. I also work in <a href=\"/markets/cedar-rapids-ia\">Cedar Rapids, Iowa</a> and <a href=\"/markets/lincoln-ne\">Lincoln, Nebraska</a>.",
      "footer-geo": "<a href=\"privacy.html\">Privacy</a> · One practice per ZIP · Des Moines, Iowa",
    },
  },
  {
    slug: "cedar-rapids-ia",
    crmCity: "Cedar Rapids, IA",
    city: "Cedar Rapids",
    state: "Iowa",
    title: "Cedar Rapids Dental Marketing &amp; Meta Ads | ArmanLeads",
    description:
      "Meta ads that put new patients in the chairs of independent dental practices in Cedar Rapids, Iowa. One practice per ZIP. The first 30 days are free. Then $697/mo, only if it's working.",
    ogTitle: "Cedar Rapids dentists: new patients in your chairs, before you pay me a cent",
    imageAlt: "ArmanLeads, Meta ads for Cedar Rapids dental practices",
    cityPlaceholder: "Cedar Rapids",
    nearby: ["Marion", "Hiawatha", "Robins"],
    copy: {
      "masthead-geo": "For <b>Cedar Rapids dentists</b>",
      "hero-eyebrow-geo": "For independent dental practices in Cedar Rapids",
      "hero-sub":
        "I run new-patient ads for independent dental practices in Cedar Rapids, one practice per ZIP. For the first 30 days you pay nothing but the ad spend itself. If new patients show up, we keep going at <strong>$697 a month</strong>. If they don't, we stop, and you're out nothing but a month of ad budget you'd have spent anyway.",
      "one-body-geo":
        "I'm not an agency. I take one practice per ZIP in Cedar Rapids, and I work it until the ads are paying for themselves several times over. Then I take one more. <strong>I'd rather be the only person watching your numbers than one of six people sort of watching them.</strong>",
      "letter-geo":
        "I started in Des Moines. Cedar Rapids is the second Iowa market I added, chosen through the same practice-by-practice research: independent-heavy, chains pushing in, small enough that one person paying attention can win a ZIP. The only honest way to earn a market is to work 30 days for free, until I've actually proven I can do what I'm saying. If it works, we keep going. If it doesn't, you didn't lose anything you wouldn't have spent anyway.",
      "letter-geo-2":
        "Selected Cedar Rapids ZIPs are open right now, on the same terms as everywhere else: 30 days free, one practice per ZIP, month-to-month after that.",
      "obj-geo-q": "\"Why dentistry, and why Cedar Rapids?\"",
      "obj-geo-a":
        "A few reasons. New patients are worth a lot over the life of the relationship, the demand is tied to one geography so ad clicks actually turn into local patients, and independent practices are getting out-spent on Google by the DSO chains pushing into Iowa. It's a niche where one person on one practice can still win. Cedar Rapids is the second Iowa market I added, picked through the same research process as the first: mid-sized, independent-heavy, and not crowded with big-spend agencies.",
      "faq-areas":
        "Cedar Rapids, Iowa, including Marion, Hiawatha, and Robins. Selected ZIPs are open right now. One practice per ZIP, so each area is exclusive. I also work in <a href=\"/markets/des-moines-ia\">Des Moines, Iowa</a> and <a href=\"/markets/lincoln-ne\">Lincoln, Nebraska</a>.",
      "footer-geo": "<a href=\"privacy.html\">Privacy</a> · One practice per ZIP · Cedar Rapids, Iowa",
    },
  },
  {
    slug: "lincoln-ne",
    crmCity: "Lincoln, NE",
    city: "Lincoln",
    state: "Nebraska",
    title: "Lincoln Dental Marketing &amp; Meta Ads | ArmanLeads",
    description:
      "Meta ads that put new patients in the chairs of independent dental practices in Lincoln, Nebraska. One practice per ZIP. The first 30 days are free. Then $697/mo, only if it's working.",
    ogTitle: "Lincoln dentists: new patients in your chairs, before you pay me a cent",
    imageAlt: "ArmanLeads, Meta ads for Lincoln dental practices",
    cityPlaceholder: "Lincoln",
    nearby: ["Waverly", "Hickman", "Walton"],
    copy: {
      "masthead-geo": "For <b>Lincoln dentists</b>",
      "hero-eyebrow-geo": "For independent dental practices in Lincoln",
      "hero-sub":
        "I run new-patient ads for independent dental practices in Lincoln, one practice per ZIP. For the first 30 days you pay nothing but the ad spend itself. If new patients show up, we keep going at <strong>$697 a month</strong>. If they don't, we stop, and you're out nothing but a month of ad budget you'd have spent anyway.",
      "one-body-geo":
        "I'm not an agency. I take one practice per ZIP in Lincoln, and I work it until the ads are paying for themselves several times over. Then I take one more. <strong>I'd rather be the only person watching your numbers than one of six people sort of watching them.</strong>",
      "letter-geo":
        "I started in Des Moines, expanded to Cedar Rapids, and Lincoln is the first Nebraska market, selected through the same focused research process. The only honest way to earn a market is to work 30 days for free, until I've actually proven I can do what I'm saying. If it works, we keep going. If it doesn't, you didn't lose anything you wouldn't have spent anyway.",
      "letter-geo-2":
        "Selected Lincoln ZIPs are open right now, on the same terms as everywhere else: 30 days free, one practice per ZIP, month-to-month after that.",
      "obj-geo-q": "\"Why dentistry, and why Lincoln?\"",
      "obj-geo-a":
        "A few reasons. New patients are worth a lot over the life of the relationship, the demand is tied to one geography so ad clicks actually turn into local patients, and independent practices are getting out-spent on Google by the DSO chains pushing into the Midwest. It's a niche where one person on one practice can still win. Lincoln is the first Nebraska market I opened, chosen through the same focused research process as the two Iowa markets before it: mid-sized, independent-heavy, and not crowded with big-spend agencies.",
      "faq-areas":
        "Lincoln, Nebraska, including Waverly, Hickman, and Walton. Selected ZIPs are open right now. One practice per ZIP, so each area is exclusive. I also work in <a href=\"/markets/des-moines-ia\">Des Moines, Iowa</a> and <a href=\"/markets/cedar-rapids-ia\">Cedar Rapids, Iowa</a>.",
      "footer-geo": "<a href=\"privacy.html\">Privacy</a> · One practice per ZIP · Lincoln, Nebraska",
    },
  },
];

/** @type {Map<string, Market>} */
const BY_SLUG = new Map(MARKETS.map((m) => [m.slug, m]));
/** @type {Map<string, Market>} */
const BY_CRM_CITY = new Map(MARKETS.map((m) => [m.crmCity.toLowerCase(), m]));

/** @param {string} slug @returns {Market | undefined} */
export function marketBySlug(slug) {
  return BY_SLUG.get(String(slug || "").toLowerCase());
}

/**
 * Maps a CRM lead's stored city onto its permanent market page.
 * @param {string} city Exact stored value, e.g. "Cedar Rapids, IA".
 * @returns {string} Path to redirect to; "/" when the city isn't a market.
 */
export function pathForCity(city) {
  const m = BY_CRM_CITY.get(String(city || "").trim().toLowerCase());
  return m ? `/markets/${m.slug}` : "/";
}

/** Plain-text service-area sentence for the structured data. @param {Market} m */
function areaText(m) {
  return `${m.city}, ${m.state}, including ${m.nearby.join(", ")}. Selected ZIPs are open. ArmanLeads works with one practice per ZIP code, so each area is exclusive. Practices in the other current focus markets can ask about availability.`;
}

/** @param {Market} m @param {string} origin */
function structuredData(m, origin) {
  const url = `${origin}/markets/${m.slug}`;
  const business = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${url}#armanleads`,
    name: "ArmanLeads",
    description: `Meta (Facebook and Instagram) ad campaigns that bring new patients to independent dental practices in ${m.city}, ${m.state}. ${EXCLUSIVITY} ${OFFER}`,
    url,
    image: `${origin}/og-image.jpg`,
    email: "arman@armanleads.com",
    founder: {
      "@type": "Person",
      name: "Arman",
      jobTitle: "Founder",
      address: { "@type": "PostalAddress", addressLocality: "Slemani", addressRegion: "Kurdistan" },
    },
    serviceType: "Dental practice marketing and paid advertising",
    knowsAbout: [
      "Dental marketing",
      "Meta advertising",
      "Facebook Ads for dentists",
      "Instagram Ads",
      "New patient acquisition",
      "Local lead generation",
    ],
    areaServed: [
      { "@type": "City", name: m.city, containedInPlace: { "@type": "State", name: m.state } },
      ...m.nearby.map((name) => ({ "@type": "City", name })),
      { "@type": "State", name: m.state },
    ],
    offers: {
      "@type": "Offer",
      name: "30-day free trial",
      price: "0",
      priceCurrency: "USD",
      description: "The first 30 days are free. After that, $697/month, only if it is working.",
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Does ArmanLeads work with dentists in ${m.city}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ${m.city}, ${m.state} is one of the current focus markets, and selected ZIPs are open. ${EXCLUSIVITY}`,
        },
      },
      {
        "@type": "Question",
        name: "What does ArmanLeads cost?",
        acceptedAnswer: { "@type": "Answer", text: OFFER },
      },
      {
        "@type": "Question",
        name: `Which areas does ArmanLeads serve around ${m.city}?`,
        acceptedAnswer: { "@type": "Answer", text: areaText(m) },
      },
      {
        "@type": "Question",
        name: "Is there a contract?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. It is month-to-month and you can cancel with one email at any time. There is no setup fee, no minimum term, and no cancellation penalty.",
        },
      },
      {
        "@type": "Question",
        name: "Who runs ArmanLeads?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Arman, a paid-ads specialist based in Slemani, Kurdistan, working US Central hours. One person, one practice per ZIP, accountable for the results.",
        },
      },
    ],
  };

  return { business, faq };
}

/** JSON-LD is injected into a <script> body, so a literal "</" would end it early. */
function jsonForScript(value) {
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

/**
 * Replaces the inner HTML of the element carrying data-mkt="<name>".
 * Slot elements never nest another element of the same tag, so the lazy
 * match is safe; an unmatched slot leaves the homepage wording in place.
 * @param {string} html @param {string} name @param {string} inner
 */
function fillSlot(html, name, inner) {
  const re = new RegExp(
    `(<([a-zA-Z0-9]+)[^>]*\\sdata-mkt="${name}"[^>]*>)([\\s\\S]*?)(</\\2>)`
  );
  return html.replace(re, (_m, open, _tag, _old, close) => open + inner + close);
}

/** @param {string} html @param {RegExp} re @param {string} value */
function replaceOne(html, re, value) {
  return html.replace(re, (m, a, b) => a + value + b);
}

/**
 * Renders a market page from the homepage HTML. Same document, same styles,
 * same DOM — only marked copy and head metadata differ.
 * @param {string} html Contents of index.html.
 * @param {Market} m
 * @param {string} origin e.g. "https://armanleads.com"
 * @returns {string}
 */
export function renderMarket(html, m, origin) {
  let out = html;
  for (const [name, inner] of Object.entries(m.copy)) out = fillSlot(out, name, inner);

  const url = `${origin}/markets/${m.slug}`;
  const { business, faq } = structuredData(m, origin);
  out = fillSlot(out, "ld-business", `\n${jsonForScript(business)}\n`);
  out = fillSlot(out, "ld-faq", `\n${jsonForScript(faq)}\n`);

  out = replaceOne(out, /(<title>)[\s\S]*?(<\/title>)/, m.title);
  out = replaceOne(out, /(<meta name="description" content=")[^"]*(">)/, m.description);
  out = replaceOne(out, /(<link rel="canonical" href=")[^"]*(">)/, url);
  out = replaceOne(out, /(<meta property="og:url" content=")[^"]*(">)/, url);
  out = replaceOne(out, /(<meta property="og:title" content=")[^"]*(">)/, m.ogTitle);
  out = replaceOne(out, /(<meta property="og:description" content=")[^"]*(">)/, m.description);
  out = replaceOne(out, /(<meta property="og:image:alt" content=")[^"]*(">)/, m.imageAlt);
  out = replaceOne(out, /(<meta name="twitter:title" content=")[^"]*(">)/, m.ogTitle);
  out = replaceOne(out, /(<meta name="twitter:description" content=")[^"]*(">)/, m.description);
  out = replaceOne(out, /(<input type="text" id="f-city"[^>]*placeholder=")[^"]*(")/, m.cityPlaceholder);

  return out;
}
