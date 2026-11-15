/* NAiDS Lab website — single-page app on hash routes.
   Content you edit lives in /data (publications, posts, events) and /posts (blog post text in Markdown). */

/* ====== SETTINGS: edit these ====== */
const CONFIG = {
  email: "info@naidslab.org",
  web3formsKey: "",          // paste your Web3Forms access key here to make the contact form send email
  nprPerUsd: 140,            // exchange rate used for international prices
  intlFactor: 2              // international price = NPR converted × this factor
};

/* ====== helpers ====== */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const num = n => n.toLocaleString("en-US");
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function fmtDate(iso){ if (!iso) return "Date TBA"; const [y,m,d] = iso.split("-").map(Number); return `${d} ${MONTHS[m-1]} ${y}`; }
function usd(n){ const v = n * CONFIG.intlFactor / CONFIG.nprPerUsd; const step = v < 20 ? 1 : v < 200 ? 5 : 10; return Math.max(1, Math.round(v / step) * step); }
function price(spec, suffix = ""){
  let npr, intl, from = "";
  if (spec.endsWith("+")) { const a = +spec.slice(0, -1); from = "From "; npr = num(a); intl = num(usd(a)); }
  else { const [a, b] = spec.split("-").map(Number); npr = b ? `${num(a)}–${num(b)}` : num(a); intl = b ? `${num(usd(a))}–${num(usd(b))}` : num(usd(a)); }
  return `<span class="npr">${from}NPR ${npr}${suffix}</span> <span class="intl">(US$${intl}${suffix})</span>`;
}
const cache = {};
async function getJSON(path){ if (!cache[path]) cache[path] = fetch(path).then(r => { if (!r.ok) throw new Error(path); return r.json(); }); return cache[path]; }
async function getText(path){ const r = await fetch(path); if (!r.ok) throw new Error(path); return r.text(); }
const ticks = list => `<ul class="ticks">${list.map(x => `<li>${x}</li>`).join("")}</ul>`;
const icon = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  open: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  hand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21C7 17 3 13.5 3 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9 2.5C21 13.5 17 17 12 21z"/></svg>'
};

function pageHero({ img, eyebrow, title, lede, actions = "", crumb }){
  return `<div class="page-hero"><img src="${img}" alt="">
    <div class="wrap">
      ${crumb ? `<div class="crumbs"><a href="#home">Home</a> / ${crumb}</div>` : ""}
      <span class="eyebrow">${eyebrow}</span>
      <h1>${title}</h1>
      ${lede ? `<p class="lede">${lede}</p>` : ""}
      ${actions ? `<div class="actions" style="margin-top:8px">${actions}</div>` : ""}
    </div></div>`;
}
const ctaBand = (title = "Work with NAiDS Lab", text = "Start with a free 15-minute call about your research, project or partnership.", btn = "Get in touch") =>
  `<div class="cta-band"><div class="wrap"><div style="display:grid;gap:8px"><h2>${title}</h2><p>${text}</p></div><a class="btn primary" href="#contact">${btn}</a></div></div>`;

/* ====== static content ====== */
const PROGRAMMES = [
  ["geospatial", "Geospatial AI", "Satellite-based land use, crop and pasture monitoring, and disaster mapping.", ["Satellite data fusion", "Land-cover and crop mapping", "Flood and landslide mapping"]],
  ["agriculture", "AI for Agriculture", "Crop disease detection, yield estimation and precision agriculture.", ["Crop disease detection", "Yield and biomass estimation", "Drone and field imaging"]],
  ["climate", "Climate & Environment", "Climate risk, drought monitoring and environmental modelling.", ["Drought monitoring", "Climate risk indicators", "Environmental modelling"]],
  ["applied", "Applied AI & Data Science", "Predictive analytics, computer vision and decision support.", ["Predictive modelling", "Computer vision", "Decision support tools"]],
  ["nlp", "Multimodal AI & NLP", "Multimodal learning, Nepali NLP and small language models.", ["Nepali text classification", "Small language models", "Multimodal learning"]]
];
const RESEARCHER_SVC = [
  ["Initial research consultation", "A focused first session to understand your project and agree the next step.", ["Your question and context", "Where you're stuck", "Which service fits, if any"], "1000", " · 45–60 min"],
  ["Research topic development", "Turning a broad interest into a researchable, publishable topic.", ["Topic refinement", "Identifying the research gap", "Clear aims and objectives"], "3000-5000"],
  ["Research proposal mentoring", "Three structured sessions to build a strong proposal.", ["Structure and argument", "Methodology and feasibility", "Written feedback between sessions"], "5000-8000"],
  ["Research methodology consultation", "Choosing a design that answers your question convincingly.", ["Research design", "Sampling and sample size", "Data collection approach"], "2000-4000"],
  ["Statistical analysis mentoring", "Learn to choose and apply the right methods yourself.", ["Selecting tests", "Running and checking analyses", "Interpreting and reporting"], "2000-3500", " /session"],
  ["Data analysis support", "Analysis of a defined dataset, priced by complexity.", ["Cleaning and preparation", "Statistical or ML analysis", "Tables and interpretation notes"], "5000-20000"],
  ["Academic manuscript review", "Expert feedback before you submit.", ["Structure, clarity and presentation", "Methods and results reporting", "Fit with the target journal"], "5000-12000"],
  ["Academic language editing", "Editing an existing manuscript for clear academic English.", ["Language and grammar", "Clarity and flow", "Consistent style"], "800-1500", " /1,000 words"],
  ["Research figures and visualisation", "Figures that show your data honestly and clearly.", ["Charts and research figures", "Tables and layout", "Colours, labels and accessibility"], "1500-5000"],
  ["Research publication strategy", "Choosing where and how to publish.", ["Journal suitability", "Submission planning", "Responding to reviewers"], "2000-3500"]
];
const INST_SVC = [
  ["Research capacity development", "Programmes that build lasting research skills across a department.", ["Needs assessment", "Multi-session programmes", "Follow-up mentoring"]],
  ["Methodology and academic writing workshops", "Practical workshops for faculty and postgraduate students.", ["Research design", "Academic writing", "Publication planning"]],
  ["Statistics and research data management", "Training in analysis and good data practice.", ["Statistical methods", "Reproducible workflows", "Data management plans"]],
  ["AI and machine learning training", "Hands-on AI training for faculty and students.", ["Python and ML foundations", "Computer vision and NLP", "Responsible AI"]],
  ["Proposal and grant development", "Workshops to strengthen funding applications.", ["Proposal structure", "Budgets and work plans", "Funding opportunities"]],
  ["Research strategy and group set-up", "Support for building AI and data science capability.", ["Capacity assessments", "Establishing research groups", "Co-supervision, by arrangement"]]
];
const INST_FEES = [["Half-day workshop","15000-25000"],["Full-day workshop","25000-40000"],["Two-day training programme","45000-70000"],["Five-day specialised training","90000-150000"],["Research capacity assessment","30000-60000"],["Institutional research development package","75000-200000"],["Annual institutional support agreement","150000-400000"]];
const ORG_FEES = [["Technical consultation","3000-5000"," /hr"],["Survey and research design","30000-75000"],["Statistical analysis project","20000-75000"],["GIS and geospatial analysis","25000-100000"],["Monitoring and evaluation assignment","50000-200000"],["Technical report or policy brief","25000-75000"],["Data dashboard development","40000-150000"],["AI feasibility assessment","40000-100000"],["Custom AI/ML development","100000+"]];
const COURSES = [
  ["Python for Research and Data Science", "4–6 weeks · Beginner to intermediate", ["Python, NumPy and Pandas", "Visualisation", "Working with research datasets"], "5000-7000"],
  ["Machine Learning and AI Applications", "4–6 weeks · Intermediate", ["Core machine learning methods", "Model evaluation", "Projects and responsible AI"], "6000-9000"],
  ["Geospatial AI and Remote Sensing", "4 weeks · Intermediate", ["GIS and Google Earth Engine", "Satellite imagery and vegetation indices", "Geospatial machine learning"], "6000-9000"],
  ["Research Methodology and Academic Writing", "4 weeks · All academic levels", ["Questions and literature reviews", "Research design", "Writing and publication planning"], "4000-6000"],
  ["Research Proposal and Grant Development", "3–4 weeks · Researchers and academics", ["Proposal development", "Methodology and budgeting", "Funding opportunities"], "5000-7000"]
];
const PACKS = [
  ["Research", "Research Starter", "3000", "Topic, objectives and research design consultation.", ""],
  ["Research", "Research Development", "7000", "Three mentoring sessions and proposal feedback.", ""],
  ["Data", "Data Analysis Support", "8000+", "Consultation and analysis of a small, defined dataset.", ""],
  ["Publishing", "Academic Manuscript Review", "6000+", "Structural and technical feedback on one manuscript.", ""],
  ["Training", "Python for Research", "6000", "Structured practical training programme.", " /person"],
  ["Training", "AI and ML Applications", "8000", "Practical machine learning training.", " /person"]
];
const SERVICE_OPTIONS = ["General enquiry", "Research consultation", ...PACKS.map(p => p[1]), "Training course", "Institutional workshop or programme", "NGO / INGO research or data project", "Research partnership", "Partnership or support", "Student research internship", "Join community updates", "Speaking or media"];

const svcCard = (name, desc, list, foot) => `<article class="card svc"><div class="body"><h3>${name}</h3><p>${desc}</p>${ticks(list)}<div class="fee">${foot}</div></div></article>`;

/* ====== card builders for data ====== */
const postCard = p => `<a class="card" href="#post-${esc(p.slug)}">
  <div class="thumb"><img src="${esc(p.image)}" alt="" loading="lazy"></div>
  <div class="body"><div class="meta"><span class="tag">${esc(p.category)}</span><span>${fmtDate(p.date)}</span></div>
  <h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><div class="foot"><span class="link">Read more →</span></div></div></a>`;
const dateTile = iso => { if (!iso) return `<div class="date-tile"><b>TBA</b><span>Date</span></div>`; const [y,m,d] = iso.split("-").map(Number); return `<div class="date-tile"><b>${d}</b><span>${MONTHS[m-1]} ${y}</span></div>`; };
const eventRow = e => `<article class="event">${dateTile(e.date)}
  <div><div class="meta" style="font-family:var(--mono);font-size:.74rem;color:var(--muted);margin-bottom:6px"><span class="tag">${esc(e.type)}</span> ${esc(e.location)}${e.time ? " · " + esc(e.time) : ""}</div>
  <h3>${esc(e.title)}</h3><p>${esc(e.description)}</p></div>
  <a class="btn sm" href="${esc(e.registration || "#contact")}" data-svc="Join community updates">${e.date ? "Register" : "Notify me"}</a></article>`;
const pubRow = p => `<article class="pub"><div>
  <h3>${esc(p.title)}</h3><div class="authors">${esc(p.authors)}</div>
  <div><span class="venue">${esc(p.venue)}</span>, ${p.year} · <span class="tag">${esc(p.type)}</span> ${(p.tags || []).map(t => `<span class="tag red">${esc(t)}</span>`).join(" ")}</div></div>
  <div class="links">${p.doi ? `<a href="https://doi.org/${esc(p.doi)}">DOI</a>` : ""}${p.url ? `<a href="${esc(p.url)}">Link</a>` : ""}${p.pdf ? `<a href="${esc(p.pdf)}">PDF</a>` : ""}${p.code ? `<a href="${esc(p.code)}">Code</a>` : ""}</div></article>`;
const sortByDate = (a, b) => (b.date || "").localeCompare(a.date || "");

/* ====== views ====== */
const views = {};

views.home = async () => {
  const [posts, pubs, events] = await Promise.all([getJSON("data/posts.json"), getJSON("data/publications.json"), getJSON("data/events.json")]).catch(() => [[], [], []]);
  const latest = [...posts].sort(sortByDate).slice(0, 3);
  const latestPubs = [...pubs].sort((a, b) => b.year - a.year).slice(0, 3);
  return `
  <div class="hero"><div class="wrap">
    <div class="hero-text">
      <span class="eyebrow">Not-for-profit research lab · Nepal</span>
      <h1>Applied AI and data science research for Nepal and the world.</h1>
      <p class="lede">NAiDS Lab researches geospatial AI, agriculture, climate and Nepali language technology, and builds research capacity through training, mentoring and community events.</p>
      <div class="actions"><a class="btn primary" href="#research">Explore our research</a><a class="btn" href="#services">Work with us</a></div>
      <div class="stats">
        <div><b>5</b><span>research programmes</span></div>
        <div><b>16+</b><span>founder's publications</span></div>
        <div><b>10+</b><span>years teaching &amp; research</span></div>
        <div><b>5</b><span>training courses</span></div>
      </div>
    </div>
    <div class="hero-img"><img src="assets/img/hero.svg" alt="Placeholder image of mountain terrain contours">
      <div class="hero-badge"><b>27.7°N</b><span>Rooted in Kathmandu, collaborating worldwide on open, useful research.</span></div></div>
  </div></div>

  <section><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Research</span><h2>Our research programmes</h2><p class="lede">Driven by problems that matter in Nepal and similar settings.</p></div><a class="link" href="#research">All programmes →</a></div>
    <div class="grid g3">${PROGRAMMES.slice(0, 3).map(([k, t, d]) => `<a class="card" href="#research"><div class="thumb"><img src="assets/img/prog-${k}.svg" alt="" loading="lazy"></div><div class="body"><span class="eyebrow">Programme</span><h3>${t}</h3><p>${d}</p></div></a>`).join("")}</div>
  </div></section>

  <section class="tint"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Blog &amp; news</span><h2>Latest from the Lab</h2></div><a class="link" href="#blog">All posts →</a></div>
    ${latest.length ? `<div class="grid g3">${latest.map(postCard).join("")}</div>` : `<div class="empty">Posts will appear here.</div>`}
  </div></section>

  <section><div class="wrap grid g2" style="gap:48px;align-items:start">
    <div><div class="sec-head" style="margin-bottom:12px"><div><span class="eyebrow">Publications</span><h2>Recent publications</h2></div><a class="link" href="#publications">All →</a></div>
      ${latestPubs.map(pubRow).join("")}</div>
    <div><div class="sec-head" style="margin-bottom:20px"><div><span class="eyebrow">Events</span><h2>Coming up</h2></div><a class="link" href="#events">All →</a></div>
      <div class="stack" style="gap:14px">${events.slice(0, 3).map(eventRow).join("")}</div></div>
  </div></section>

  <section class="tint"><div class="wrap feature">
    <img src="assets/img/support.svg" alt="" loading="lazy">
    <div class="txt"><span class="eyebrow">How we're funded</span><h2>Every fee supports open research</h2>
      <p class="lede">The Lab does not distribute profit. Grants, partnerships, philanthropy, and income from fair-priced services and training all go back into research, scholarships and community programmes.</p>
      <div class="actions"><a class="btn dark" href="#support">Support the Lab</a><a class="btn" href="#services">See our services</a></div></div>
  </div></section>
  ${ctaBand()}`;
};

views.research = async () => `
  ${pageHero({ img: "assets/img/prog-geospatial.svg", eyebrow: "Research", title: "Research programmes", crumb: "Research",
    lede: "Research is the core of NAiDS Lab. We work with universities, NGOs and international partners on joint projects, grant applications and co-supervised studies.",
    actions: `<a class="btn primary" href="#contact" data-svc="Research partnership">Propose a collaboration</a><a class="btn" href="#publications">Publications</a>` })}
  <section><div class="wrap stack" style="gap:56px">
    ${PROGRAMMES.map(([k, t, d, list], i) => `<div class="feature"${i % 2 ? ' style="direction:rtl"' : ""}>
      <img src="assets/img/prog-${k}.svg" alt="" loading="lazy">
      <div class="txt" style="direction:ltr"><span class="eyebrow">Programme ${String(i + 1).padStart(2, "0")}</span><h2>${t}</h2><p class="lede">${d}</p>${ticks(list)}</div></div>`).join("")}
  </div></section>
  <section class="tint"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Outputs</span><h2>What our research produces</h2></div></div>
    <div class="chips">${["Peer-reviewed publications","Open datasets, where appropriate","Open-source software","Technical reports","Policy briefs","Demonstrator applications"].map(x => `<span class="chip">${x}</span>`).join("")}</div>
  </div></section>
  ${ctaBand("Partner with us on research", "Universities, NGOs and funders: let's design a project together.", "Propose a collaboration")}`;

views.publications = async () => {
  const pubs = await getJSON("data/publications.json").catch(() => []);
  const years = [...new Set(pubs.map(p => p.year))].sort((a, b) => b - a);
  const types = [...new Set(pubs.map(p => p.type))];
  const tags = [...new Set(pubs.flatMap(p => p.tags || []))].sort();
  return {
    html: `${pageHero({ img: "assets/img/prog-applied.svg", eyebrow: "Publications", title: "Publications", crumb: "Publications", lede: "Peer-reviewed work by NAiDS Lab researchers, including the founder's earlier publications." })}
    <section><div class="wrap">
      <div class="toolbar">
        <label class="search"><span class="sr">Search publications</span>${icon.search}<input id="pub-q" type="search" placeholder="Search titles, venues or topics"></label>
        <select class="filter" id="pub-year" aria-label="Year"><option value="">All years</option>${years.map(y => `<option>${y}</option>`).join("")}</select>
        <select class="filter" id="pub-type" aria-label="Type"><option value="">All types</option>${types.map(t => `<option>${esc(t)}</option>`).join("")}</select>
      </div>
      <div class="chips" id="pub-tags" style="margin-bottom:12px"><button class="chip" type="button" data-tag="" aria-pressed="true">All topics</button>${tags.map(t => `<button class="chip" type="button" data-tag="${esc(t)}" aria-pressed="false">${esc(t)}</button>`).join("")}</div>
      <div class="count" id="pub-count"></div>
      <div id="pub-list"></div>
    </div></section>`,
    init(){
      let tag = "";
      const draw = () => {
        const q = $("#pub-q").value.toLowerCase().trim(), y = $("#pub-year").value, t = $("#pub-type").value;
        const list = pubs.filter(p => (!y || String(p.year) === y) && (!t || p.type === t) && (!tag || (p.tags || []).includes(tag)) &&
          (!q || [p.title, p.venue, p.authors, ...(p.tags || [])].join(" ").toLowerCase().includes(q))).sort((a, b) => b.year - a.year);
        $("#pub-count").textContent = `${list.length} of ${pubs.length} publications`;
        if (!list.length) { $("#pub-list").innerHTML = `<div class="empty" style="margin-top:20px">No publications match. Try clearing a filter.</div>`; return; }
        let out = "", last = null;
        list.forEach(p => { if (p.year !== last) { out += `<div class="pub-year">${p.year}</div>`; last = p.year; } out += pubRow(p); });
        $("#pub-list").innerHTML = out;
      };
      ["#pub-q", "#pub-year", "#pub-type"].forEach(s => $(s).addEventListener("input", draw));
      $("#pub-tags").addEventListener("click", e => { const b = e.target.closest("[data-tag]"); if (!b) return; tag = b.dataset.tag; $$("#pub-tags .chip").forEach(c => c.setAttribute("aria-pressed", c === b)); draw(); });
      draw();
    }
  };
};

views.blog = async () => {
  const posts = (await getJSON("data/posts.json").catch(() => [])).sort(sortByDate);
  const cats = [...new Set(posts.map(p => p.category))];
  const featured = posts.find(p => p.featured) || posts[0];
  return {
    html: `${pageHero({ img: "assets/img/post-welcome.svg", eyebrow: "Blog & news", title: "Blog", crumb: "Blog", lede: "News, research stories and tutorials from NAiDS Lab." })}
    <section><div class="wrap">
      ${featured ? `<a class="card" href="#post-${esc(featured.slug)}" style="display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);margin-bottom:40px" id="featured">
        <div class="thumb" style="aspect-ratio:auto;min-height:260px"><img src="${esc(featured.image)}" alt=""></div>
        <div class="body" style="padding:32px;justify-content:center"><div class="meta"><span class="tag red">Featured</span><span class="tag">${esc(featured.category)}</span><span>${fmtDate(featured.date)}</span></div>
        <h2>${esc(featured.title)}</h2><p>${esc(featured.excerpt)}</p><span class="link">Read more →</span></div></a>` : ""}
      <div class="toolbar">
        <div class="chips" id="cat-chips"><button class="chip" type="button" data-cat="" aria-pressed="true">All</button>${cats.map(c => `<button class="chip" type="button" data-cat="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join("")}</div>
        <label class="search"><span class="sr">Search posts</span>${icon.search}<input id="post-q" type="search" placeholder="Search posts"></label>
      </div>
      <div class="grid g3" id="post-grid"></div>
    </div></section>`,
    init(){
      let cat = "";
      const f = $("#featured"); if (f && matchMedia("(max-width:760px)").matches) f.style.gridTemplateColumns = "1fr";
      const draw = () => {
        const q = $("#post-q").value.toLowerCase().trim();
        const list = posts.filter(p => (!cat || p.category === cat) && (!q || [p.title, p.excerpt, ...(p.tags || [])].join(" ").toLowerCase().includes(q)));
        $("#post-grid").innerHTML = list.length ? list.map(postCard).join("") : `<div class="empty" style="grid-column:1/-1">No posts match.</div>`;
      };
      $("#post-q").addEventListener("input", draw);
      $("#cat-chips").addEventListener("click", e => { const b = e.target.closest("[data-cat]"); if (!b) return; cat = b.dataset.cat; $$("#cat-chips .chip").forEach(c => c.setAttribute("aria-pressed", c === b)); draw(); });
      draw();
    }
  };
};

views.post = async slug => {
  const posts = await getJSON("data/posts.json").catch(() => []);
  const p = posts.find(x => x.slug === slug);
  if (!p) return views.notfound();
  let body;
  try { const md = await getText(`posts/${slug}.md`); body = window.marked ? marked.parse(md) : miniMarkdown(md); }
  catch { body = `<p>${esc(p.excerpt)}</p><p class="muted">The full post could not be loaded.</p>`; }
  const related = posts.filter(x => x.slug !== slug).sort(sortByDate).slice(0, 3);
  document.title = `${p.title} · NAiDS Lab`;
  return `<div class="page-hero"><img src="${esc(p.image)}" alt=""><div class="wrap">
      <div class="crumbs"><a href="#home">Home</a> / <a href="#blog">Blog</a> / ${esc(p.category)}</div>
      <h1 style="max-width:22ch">${esc(p.title)}</h1>
      <div class="post-meta"><span>${fmtDate(p.date)}</span><span>·</span><span>${esc(p.author)}</span><span>·</span><span>${esc(p.category)}</span></div></div></div>
    <section><div class="wrap"><article class="prose">${body}</article>
      <div class="author-box"><img src="assets/img/founder.png" alt=""><div><strong>${esc(p.author)}</strong><p class="muted" style="font-size:.9rem">Founder and Director, NAiDS Lab</p></div></div>
    </div></section>
    ${related.length ? `<section class="tint"><div class="wrap"><div class="sec-head"><div><h2>More from the blog</h2></div><a class="link" href="#blog">All posts →</a></div><div class="grid g3">${related.map(postCard).join("")}</div></div></section>` : ""}`;
};

views.events = async () => {
  const events = (await getJSON("data/events.json").catch(() => []));
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter(e => !e.date || e.date >= today).sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
  const past = events.filter(e => e.date && e.date < today).sort(sortByDate);
  return `${pageHero({ img: "assets/img/event-workshop.svg", eyebrow: "Events & community", title: "Events and community", crumb: "Events",
      lede: "Seminars, workshops, training cohorts and mentoring that connect Nepal's AI and data science community.",
      actions: `<a class="btn primary" href="#contact" data-svc="Join community updates">Get event updates</a>` })}
    <section><div class="wrap">
      <div class="sec-head"><div><span class="eyebrow">Calendar</span><h2>Upcoming events</h2></div></div>
      <div class="stack" style="gap:14px">${upcoming.length ? upcoming.map(eventRow).join("") : `<div class="empty">No upcoming events yet. Check back soon.</div>`}</div>
      ${past.length ? `<div class="sec-head" style="margin-top:48px"><div><h2>Past events</h2></div></div><div class="stack" style="gap:14px">${past.map(eventRow).join("")}</div>` : ""}
    </div></section>
    <section class="tint"><div class="wrap">
      <div class="sec-head"><div><span class="eyebrow">Community programmes</span><h2>How we build community</h2></div></div>
      <div class="grid g4">
        ${svcCard("Seminar series", "Free online talks on applied AI and research methods.", ["Speakers from Nepal and abroad", "Recordings shared openly"], '<span class="lbl">Status</span>Planned')}
        ${svcCard("Annual workshop", "A national workshop with partner universities.", ["Tutorials and keynotes", "Student paper sessions"], '<span class="lbl">Status</span>Planned')}
        ${svcCard("Research internships", "Mentored research for talented undergraduates.", ["Real Lab projects", "Co-authorship where merited"], '<span class="lbl">Status</span>Expressions of interest open')}
        ${svcCard("Open resources", "Free tutorials, notebooks and example datasets.", ["Nepal-relevant data", "Research method guides"], '<span class="lbl">Status</span>In development')}
      </div>
    </div></section>
    ${ctaBand("Speak, host or volunteer", "Want to give a talk, host a workshop or join as a student intern? Let us know.", "Get involved")}`;
};

views.training = async () => `
  ${pageHero({ img: "assets/img/training.svg", eyebrow: "Training", title: "Small cohorts, live teaching, real projects", crumb: "Training",
    lede: "Each course combines live sessions, practical assignments and a final mini-project, online or in person. Participants who complete receive a NAiDS Lab certificate.",
    actions: `<a class="btn primary" href="#contact" data-svc="Training course">Register interest</a>` })}
  <section><div class="wrap stack">
    <div class="grid g3">${COURSES.map(([t, m, list, fee]) => `<article class="card svc"><div class="body"><span class="eyebrow">${m}</span><h3>${t}</h3>${ticks(list)}<div class="fee price-big">${price(fee)}<span class="muted" style="font-size:.8rem;display:block">per participant</span></div></div></article>`).join("")}
      <article class="card svc" style="background:var(--sunk)"><div class="body"><span class="eyebrow">For universities</span><h3>Custom training for your institution</h3><p>Any course can be delivered as a workshop or programme for your faculty and students, with partner discounts.</p><div class="foot"><a class="link" href="#institutions">Institutional training →</a></div></div></article></div>
    <div class="chips">${["10–15 participants per online cohort","10–12 per in-person cohort","Certificate of completion","Limited scholarships","Reduced fees for university partners"].map(x => `<span class="chip">${x}</span>`).join("")}</div>
  </div></section>
  ${ctaBand("Join the next cohort", "Register your interest and we'll tell you when enrolment opens.", "Register interest")}`;

views.services = async () => `
  ${pageHero({ img: "assets/img/prog-applied.svg", eyebrow: "Research & advisory services", title: "Expert support that funds independent research", crumb: "Services",
    lede: "Services are delivered by Dr Shahi and Lab associates. Prices are in NPR for clients in Nepal, with the international price in brackets." })}
  <section><div class="wrap">
    <div class="sec-head"><div><h2>Who we work with</h2></div></div>
    <div class="grid g3">
      <a class="card" href="#researchers"><div class="thumb"><img src="assets/img/post-python.svg" alt="" loading="lazy"></div><div class="body"><span class="eyebrow">For</span><h3>Researchers &amp; students</h3><p>Plan, analyse and publish strong research.</p><span class="link foot">Explore →</span></div></a>
      <a class="card" href="#institutions"><div class="thumb"><img src="assets/img/about.svg" alt="" loading="lazy"></div><div class="body"><span class="eyebrow">For</span><h3>Universities &amp; institutions</h3><p>Training and capacity building for stronger research outputs.</p><span class="link foot">Explore →</span></div></a>
      <a class="card" href="#organisations"><div class="thumb"><img src="assets/img/prog-climate.svg" alt="" loading="lazy"></div><div class="body"><span class="eyebrow">For</span><h3>NGOs, INGOs &amp; agencies</h3><p>Evaluation, data science, GIS and AI advice.</p><span class="link foot">Explore →</span></div></a>
    </div>
  </div></section>
  <section class="tint"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Start here</span><h2>Launch packages</h2><p class="lede">Six fixed-price packages. Larger work receives an individual quotation.</p></div></div>
    <div class="grid g3">${PACKS.map(([k, t, fee, d, suf]) => `<article class="card svc"><div class="body"><span class="eyebrow">${k}</span><h3>${t}</h3><p>${d}</p><div class="fee price-big">${price(fee, suf)}</div><a class="link" href="#contact" data-svc="${t}">Enquire →</a></div></article>`).join("")}</div>
  </div></section>
  ${ctaBand("Not sure what you need?", "Book a free 15-minute suitability call and we'll point you to the right service.", "Book a free call")}`;

views.researchers = async () => `
  ${pageHero({ img: "assets/img/post-python.svg", eyebrow: "Services for researchers", title: "Helping researchers produce work they can publish with confidence", crumb: `<a href="#services">Services</a> / Researchers`,
    lede: "For postgraduate students, early-career academics and research teams.", actions: `<a class="btn primary" href="#contact" data-svc="Research consultation">Request a quote</a>` })}
  <section><div class="wrap stack">
    <div class="grid g2">${RESEARCHER_SVC.map(([n, d, l, f, s]) => svcCard(n, d, l, price(f, s))).join("")}
      ${svcCard("Bespoke services", "Larger or unusual projects, scoped with you.", ["Research communication", "Grant writing support and review", "Multi-stage or team projects"], '<span class="lbl">Fee</span>Personalised quote')}</div>
    <div class="callout"><b>Your research stays yours.</b> We mentor, advise, edit and support analysis. We do not write theses or manuscripts on anyone's behalf. Ownership, data integrity and authorship remain with the researcher.</div>
  </div></section>${ctaBand()}`;

views.institutions = async () => `
  ${pageHero({ img: "assets/img/about.svg", eyebrow: "Services for institutions", title: "Training and support that strengthens research capacity", crumb: `<a href="#services">Services</a> / Institutions`,
    lede: "For universities, colleges, research centres and academic departments.", actions: `<a class="btn primary" href="#contact" data-svc="Institutional workshop or programme">Request a quote</a>` })}
  <section><div class="wrap stack">
    <div class="grid g3">${INST_SVC.map(([n, d, l]) => svcCard(n, d, l, '<span class="lbl">Fee</span>See table below')).join("")}</div>
    <div><h2 style="margin-bottom:16px">Institutional fees</h2>
      <div class="table-wrap"><table><thead><tr><th>Service</th><th class="price">Fee</th></tr></thead><tbody>${INST_FEES.map(([n, f]) => `<tr><td>${n}</td><td class="price">${price(f)}</td></tr>`).join("")}</tbody></table></div>
      <p class="note" style="margin-top:12px">Travel, accommodation, venue and other direct costs are charged separately. Partner universities receive a 10–15% discount where viable.</p></div>
  </div></section>${ctaBand()}`;

views.organisations = async () => `
  ${pageHero({ img: "assets/img/prog-climate.svg", eyebrow: "Services for organisations", title: "A technical research and data science partner", crumb: `<a href="#services">Services</a> / Organisations`,
    lede: "For NGOs, INGOs, government agencies and businesses that need rigorous evidence, clear analysis or a realistic view of AI.", actions: `<a class="btn primary" href="#contact" data-svc="NGO / INGO research or data project">Request a quote</a>` })}
  <section><div class="wrap stack">
    <div class="grid g3">
      ${svcCard("Research and evaluation", "Evidence that stands up to donors and reviewers.", ["Baseline, midline and endline studies", "M&amp;E frameworks", "Survey design and data collection planning", "Quantitative and qualitative analysis", "Impact assessment reports"], '<span class="lbl">Fee</span>Indicative fees below')}
      ${svcCard("Data science and analytics", "Turning messy data into decisions.", ["Data cleaning and integration", "Statistical and predictive modelling", "Dashboards and visualisation", "Geospatial analysis", "Decision support systems"], '<span class="lbl">Fee</span>Indicative fees below')}
      ${svcCard("AI and technology advice", "Practical AI, scoped honestly.", ["AI feasibility assessments", "Machine learning solutions", "Computer vision applications", "Satellite data analysis", "AI adoption advice"], '<span class="lbl">Fee</span>Indicative fees below')}
    </div>
    <div><h2 style="margin-bottom:16px">Indicative project fees</h2>
      <div class="table-wrap"><table><thead><tr><th>Service</th><th class="price">Indicative fee</th></tr></thead><tbody>${ORG_FEES.map(([n, f, s]) => `<tr><td>${n}</td><td class="price">${price(f, s)}</td></tr>`).join("")}</tbody></table></div>
      <p class="note" style="margin-top:12px">Every assignment is scoped by data availability, complexity, fieldwork, delivery time and staffing. Fieldwork, travel, software, cloud computing and data acquisition are quoted separately.</p></div>
  </div></section>${ctaBand()}`;

views.support = async () => `
  ${pageHero({ img: "assets/img/support.svg", eyebrow: "Support us", title: "Help build research capacity in Nepal", crumb: "Support us",
    lede: "Partners and supporters make our independent research, scholarships and community programmes possible.", actions: `<a class="btn primary" href="#contact" data-svc="Partnership or support">Talk to us</a>` })}
  <section><div class="wrap grid g2">
    ${svcCard("Research partnership", "Joint research projects and grant applications.", ["Universities and research centres", "NGOs and INGOs with research needs", "International collaborators and funders"], '<span class="lbl">How</span>Propose a project')}
    ${svcCard("Fund a scholarship", "Cover training places for students who cannot afford the fee.", ["Python, ML and geospatial AI courses", "Priority for students outside Kathmandu", "Reports on who you supported"], '<span class="lbl">How</span>Sponsor one or more places')}
    ${svcCard("Sponsor an event", "Support our seminars and annual workshop.", ["Recognition at the event and online", "Meet researchers and students", "Keep events open and low-cost"], '<span class="lbl">How</span>Contact us for options')}
    ${svcCard("Donate", "General support for open research and community programmes.", ["Funds research where it's most needed", "Transparent reporting on how gifts are used", "Details once registration is complete"], '<span class="lbl">Status</span>Coming soon')}
  </div></section>${ctaBand("Let's talk about partnership", "Tell us what you'd like to support and we'll suggest options.", "Contact us")}`;

views.about = async () => `
  ${pageHero({ img: "assets/img/about.svg", eyebrow: "About", title: "About NAiDS Lab", crumb: "About",
    lede: "A not-for-profit research lab for AI and data science, being established in Nepal and working with partners worldwide." })}
  <section><div class="wrap feature">
    <div class="txt"><span class="eyebrow">Mission</span><h2>Useful, open research that serves Nepal and travels the world</h2>
      <p>NAiDS Lab produces applied research in AI and data science and grows the next generation of researchers in Nepal. We combine independent research with training, mentoring and community events, and offer fair-priced research services to help fund that work.</p>
      <p class="muted">We are being established as a not-for-profit organisation. All service and training income is reinvested in research, scholarships and community programmes.</p></div>
    <img src="assets/img/community.svg" alt="" loading="lazy">
  </div></section>
  <section class="tint"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Values</span><h2>What we stand for</h2></div></div>
    <div class="grid g4">
      <div class="value"><div class="ic">${icon.shield}</div><h3>Research integrity</h3><p>Ownership, authorship and data integrity stay with researchers.</p></div>
      <div class="value"><div class="ic">${icon.open}</div><h3>Open science</h3><p>We share data, code and findings openly where we can.</p></div>
      <div class="value"><div class="ic">${icon.pin}</div><h3>Local relevance</h3><p>We focus on problems that matter in Nepal and similar settings.</p></div>
      <div class="value"><div class="ic">${icon.hand}</div><h3>Fair access</h3><p>Affordable rates and scholarships for students.</p></div>
    </div>
  </div></section>
  <section><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Team</span><h2>Founder and Director</h2></div></div>
    <div class="profile">
      <img src="assets/img/founder.png" alt="Photo placeholder for Dr Tej Bahadur Shahi">
      <div class="stack" style="gap:16px">
        <div><h3 style="font-size:1.6rem">Dr Tej Bahadur Shahi</h3><p class="muted">Founder and Director · PhD, Central Queensland University</p></div>
        <p>Dr Shahi is a computer scientist working where machine learning, image processing and remote sensing meet. He is a Postdoctoral Fellow in the School of Computer Science at Queensland University of Technology, where his work applies AI, drones and image processing to agricultural systems.</p>
        <p>He previously spent more than seven years as an Assistant Professor of Computer Science at Tribhuvan University, supervising master's dissertations, and over four years as an Information Technology Officer with the Government of Nepal.</p>
        <dl class="facts">
          <div><dt>Research areas</dt><dd>Machine learning, computer vision, remote sensing and satellite data fusion, crop estimation, Nepali NLP</dd></div>
          <div><dt>Published in</dt><dd>Artificial Intelligence Review, Scientific Reports, PLOS One, Journal of Applied Remote Sensing, Mathematics, Journal of Imaging</dd></div>
          <div><dt>Teaching</dt><dd>7+ years at Tribhuvan University; 4+ master's dissertations supervised</dd></div>
        </dl>
        <div class="actions"><a class="btn sm" href="https://tejshahi.github.io/publications">Full publication list</a><a class="btn sm" href="#publications">Lab publications</a></div>
      </div>
    </div>
    <div class="callout" style="margin-top:40px"><b>Join the team.</b> We welcome research associates, collaborators and student interns. <a class="link" href="#contact" data-svc="Student research internship">Express interest →</a></div>
  </div></section>
  <section class="tint"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Terms</span><h2>How we work</h2></div></div>
    <ol class="terms">${["Your first 15-minute suitability call is free. Substantive technical advice is charged.","Project work is billed 50% upfront, with the balance on agreed milestones.","Prices in NPR apply to clients in Nepal. Prices in brackets apply to clients abroad and are billed in US dollars.","10–15% discount for student groups and university partners, where viable.","Fieldwork, travel, software, cloud computing and data acquisition are quoted separately.","Limited subsidised places for students who cannot afford the full fee.","Every engagement has a written agreement covering deliverables, timelines, revisions, confidentiality and intellectual property.","All service and training income is reinvested in the Lab's research and community programmes."].map(t => `<li><span>${t}</span></li>`).join("")}</ol>
  </div></section>${ctaBand()}`;

let pendingService = "";
views.contact = async () => ({
  html: `${pageHero({ img: "assets/img/hero.svg", eyebrow: "Contact", title: "Get in touch", crumb: "Contact", lede: "Start with a free 15-minute suitability call. We'll reply with next steps and, for project work, a written quotation." })}
  <section><div class="wrap grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1.7fr);gap:48px" id="contact-grid">
    <div class="contact-side">
      <div class="contact-item"><span class="eyebrow">Email</span><span class="mono" style="font-size:1rem;user-select:all">${CONFIG.email}</span><div><button class="btn sm" type="button" id="copy-email" style="margin-top:8px">Copy email</button></div></div>
      <div class="contact-item"><span class="eyebrow">Location</span><span>Kathmandu, Nepal · working with clients worldwide</span></div>
      <div class="contact-item"><span class="eyebrow">Response time</span><span>Usually within two working days</span></div>
    </div>
    <form class="form" id="enq" novalidate>
      <label>Name<input id="f-name" name="name" required autocomplete="name"></label>
      <label>Email<input id="f-email" name="email" type="email" required autocomplete="email"></label>
      <label>Country<input id="f-country" name="country" autocomplete="country-name" placeholder="e.g. Nepal"></label>
      <label>I am a…<select id="f-type" name="client_type">${["Student or early-career researcher","Experienced researcher","University or institution","NGO / INGO","Company or professional","Funder or research partner","Other"].map(o => `<option>${o}</option>`).join("")}</select></label>
      <label class="full">Enquiry about<select id="f-service" name="service">${SERVICE_OPTIONS.map(o => `<option>${esc(o)}</option>`).join("")}</select></label>
      <label class="full">Message<textarea id="f-msg" name="message" placeholder="Your topic, timeline, dataset size or audience"></textarea></label>
      <div class="full" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><button class="btn primary" type="submit" id="f-submit">Send enquiry</button><span class="err" id="f-err" hidden></span></div>
      <div class="out" id="f-out" hidden></div>
    </form>
  </div></section>`,
  init(){
    if (matchMedia("(max-width:820px)").matches) $("#contact-grid").style.gridTemplateColumns = "1fr";
    if (pendingService) { const o = [...$("#f-service").options].find(x => x.text === pendingService); if (o) $("#f-service").value = o.text; pendingService = ""; }
    $("#copy-email").onclick = e => copyText(CONFIG.email, e.currentTarget, "Copy email");
    $("#enq").addEventListener("submit", async e => {
      e.preventDefault();
      const v = id => $("#" + id).value.trim(), err = $("#f-err"), out = $("#f-out");
      if (!v("f-name") || !/^\S+@\S+\.\S+$/.test(v("f-email"))) { err.textContent = "Add your name and a valid email address so we can reply."; err.hidden = false; return; }
      err.hidden = true;
      const subject = `Website enquiry: ${v("f-service")}`;
      const text = `Name: ${v("f-name")}\nEmail: ${v("f-email")}\nCountry: ${v("f-country") || "—"}\nI am a: ${v("f-type")}\nEnquiry about: ${v("f-service")}\n\n${v("f-msg") || "I'd like to book a free 15-minute suitability call."}`;
      if (CONFIG.web3formsKey) {
        const btn = $("#f-submit"); btn.disabled = true; btn.textContent = "Sending…";
        try {
          const r = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ access_key: CONFIG.web3formsKey, subject, from_name: "NAiDS Lab website", name: v("f-name"), email: v("f-email"), country: v("f-country"), client_type: v("f-type"), service: v("f-service"), message: v("f-msg") }) });
          const j = await r.json();
          if (!j.success) throw new Error(j.message);
          out.innerHTML = `<p class="ok">Thank you, ${esc(v("f-name"))}. Your enquiry has been sent. We'll reply within two working days.</p>`; out.hidden = false; e.target.reset();
          btn.textContent = "Sent"; return;
        } catch { btn.disabled = false; btn.textContent = "Send enquiry"; }
      }
      out.innerHTML = `<strong>Please email us your enquiry.</strong><p class="muted" style="font-size:.88rem">Copy the text below and send it to ${CONFIG.email}.</p><pre id="f-text">To: ${CONFIG.email}\nSubject: ${esc(subject)}\n\n${esc(text)}</pre><div><button class="btn sm" type="button" id="f-copy">Copy enquiry</button></div>`;
      out.hidden = false;
      $("#f-copy").onclick = ev => copyText($("#f-text").textContent, ev.currentTarget, "Copy enquiry");
    });
  }
});

views.notfound = async () => `<section><div class="wrap stack" style="padding-block:60px"><span class="eyebrow">404</span><h1>Page not found</h1><p class="lede">The page you're looking for doesn't exist or has moved.</p><div class="actions"><a class="btn primary" href="#home">Go to the home page</a></div></div></section>`;

/* Small Markdown renderer used if the Markdown library can't load. */
function miniMarkdown(md){
  const inline = t => esc(t).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>").replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  const lines = md.replace(/\r/g, "").split("\n"); let html = "", i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) { let code = []; i++; while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]); i++; html += `<pre><code>${esc(code.join("\n"))}</code></pre>`; continue; }
    const h = l.match(/^(#{1,4})\s+(.*)/); if (h) { const n = Math.max(2, h[1].length); html += `<h${n}>${inline(h[2])}</h${n}>`; i++; continue; }
    if (/^(-{3,}|\*{3,})\s*$/.test(l)) { html += "<hr>"; i++; continue; }
    if (/^>\s?/.test(l)) { let q = []; while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, "")); html += `<blockquote><p>${inline(q.join(" "))}</p></blockquote>`; continue; }
    if (/^\s*[-*]\s+/.test(l)) { let it = []; while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) it.push(lines[i++].replace(/^\s*[-*]\s+/, "")); html += `<ul>${it.map(x => `<li>${inline(x)}</li>`).join("")}</ul>`; continue; }
    if (/^\s*\d+\.\s+/.test(l)) { let it = []; while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) it.push(lines[i++].replace(/^\s*\d+\.\s+/, "")); html += `<ol>${it.map(x => `<li>${inline(x)}</li>`).join("")}</ol>`; continue; }
    if (!l.trim()) { i++; continue; }
    let p = []; while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|>|\s*[-*]\s+|\s*\d+\.\s+|-{3,})/.test(lines[i])) p.push(lines[i++]);
    html += `<p>${inline(p.join(" "))}</p>`;
  }
  return html;
}

async function copyText(text, btn, label){
  try { await navigator.clipboard.writeText(text); btn.textContent = "Copied"; } catch { btn.textContent = "Select and copy manually"; }
  setTimeout(() => (btn.textContent = label), 2000);
}

/* ====== router ====== */
const TITLES = { home: "NAiDS Lab", research: "Research", publications: "Publications", blog: "Blog", events: "Events", training: "Training", services: "Services", researchers: "For researchers", institutions: "For institutions", organisations: "For organisations", support: "Support us", about: "About", contact: "Contact" };
const NAV_PARENT = { researchers: "services", institutions: "services", organisations: "services", support: "about" };
const main = $("#main");
let renderId = 0;
async function route(){
  const id = ++renderId;
  const h = decodeURIComponent(location.hash.slice(1)) || "home";
  let out;
  if (h.startsWith("post-")) out = await views.post(h.slice(5));
  else out = await (views[h] || views.notfound)();
  if (id !== renderId) return;
  const res = typeof out === "string" ? { html: out } : out;
  main.innerHTML = res.html;
  if (!h.startsWith("post-")) document.title = h === "home" ? "NAiDS Lab" : `${TITLES[h] || "Not found"} · NAiDS Lab`;
  const navKey = h.startsWith("post-") ? "blog" : (NAV_PARENT[h] || h);
  $$("#site-nav a").forEach(a => a.getAttribute("href") === "#" + navKey ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  $("#site-nav").classList.remove("open"); $("#menu-btn").setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
  res.init && res.init();
}
document.addEventListener("click", e => { const a = e.target.closest("a[data-svc]"); if (a) pendingService = a.dataset.svc; });
$("#menu-btn").addEventListener("click", () => { const open = $("#site-nav").classList.toggle("open"); $("#menu-btn").setAttribute("aria-expanded", open); });
window.addEventListener("hashchange", route);
$("#year").textContent = new Date().getFullYear();
route();
