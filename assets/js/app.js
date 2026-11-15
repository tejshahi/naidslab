/* HIDI (Himalayan Institute for Data Intelligence) website — single-page app on hash routes.
   Content you edit lives in /data (publications, posts, events) and /posts (blog post text in Markdown). */

/* ====== SETTINGS: edit these ====== */
const CONFIG = {
  email: "info@hidi.org",
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
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/></svg>',
  cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
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
const ctaBand = (title = "Work with HIDI", text = "Start with a free 15-minute call about your research, project or partnership.", btn = "Get in touch") =>
  `<div class="cta-band"><div class="wrap"><div style="display:grid;gap:8px"><h2>${title}</h2><p>${text}</p></div><a class="btn primary" href="#contact">${btn}</a></div></div>`;

/* ====== images ======
   Real figures from the founder's open-access papers (CC BY) and charts made from the open NepEMO dataset.
   To swap an image, change its path here: every page uses these names. */
const IMG = {
  hero:     "assets/img/research/pasture-clusters-panel.jpg",
  site1:    "assets/img/research/pasture-clusters-site1.jpg",
  geo:      "assets/img/research/pasture-clusters-multiyear.jpg",
  segments: "assets/img/research/pasture-segments.jpg",
  uav:      "assets/img/research/uav-cotton-field.jpg",
  weeds:    "assets/img/research/uav-weed-samples.jpg",
  leaves:   "assets/img/research/tomato-leaf-diseases.jpg",
  nlp:      "assets/img/research/nepemo-emotions.png",
  trends:   "assets/img/research/nepemo-trends.png"
};
/* Charts and diagrams that must not be cropped */
const FIT = new Set([IMG.nlp, IMG.trends, IMG.leaves, IMG.geo, IMG.segments, IMG.site1]);
const imgTag = (src, alt = "", lazy = true) => `<img src="${src}" alt="${esc(alt)}"${FIT.has(src) ? ' class="fit"' : ""}${lazy ? ' loading="lazy"' : ""}>`;

/* Image credits (shown on the Research page). Figures are reused under their CC BY licences. */
const CREDITS = [
  [IMG.hero, "Pasture segments on a New South Wales farm coloured by land use (native, improved and cropping), the reference used to test label-free pasture mapping.", "Shahi, Nayak, Woodley, Guerschman & Sabir (2025), Remote Sensing 17(21), 3601, Figure 8a", "10.3390/rs17213601", "CC BY"],
  [IMG.site1, "The same farm: (a) land-use labels and (b) pasture clusters found from Sentinel-2 time series without any labels.", "Shahi et al. (2025), Remote Sensing 17(21), 3601, Figure 8", "10.3390/rs17213601", "CC BY"],
  [IMG.geo, "Pasture clusters for 2019–20, 2021–22 and 2023–24, showing how pasture types change over time.", "Shahi et al. (2025), Remote Sensing 17(21), 3601, Figure 10", "10.3390/rs17213601", "CC BY"],
  [IMG.segments, "Quick-shift segments over satellite imagery for two study sites, the first step of object-based pasture mapping.", "Shahi et al. (2025), Remote Sensing 17(21), 3601, Figure 4", "10.3390/rs17213601", "CC BY"],
  [IMG.uav, "UAV image of a cotton field with weeds between the rows.", "Shahi, Dahal, Sitaula, Neupane & Guo (2023), Drones 7(10), 624, Figure 1a", "10.3390/drones7100624", "CC BY"],
  [IMG.weeds, "UAV input images used for deep-learning weed segmentation.", "Shahi et al. (2023), Drones 7(10), 624, Figure 8 (input column)", "10.3390/drones7100624", "CC BY"],
  [IMG.leaves, "Healthy and diseased tomato leaves from the ten classes used to train BotanicX-AI.", "Bhandari, Shahi, Neupane & Walsh (2023), Journal of Imaging 9(2), 53, Figure 1", "10.3390/jimaging9020053", "CC BY"],
  [IMG.nlp, "Emotion labels and languages in the NepEMO dataset of 4,462 Nepali Reddit posts.", "Chart by HIDI from the open NepEMO dataset (Sitoula, Shahi, Bhatt, Pokhrel & Neupane, 2025)", "10.48550/arXiv.2512.22823", "Open data"],
  [IMG.trends, "Share of NepEMO posts carrying each emotion, by year, 2019–2025.", "Chart by HIDI from the open NepEMO dataset", "10.48550/arXiv.2512.22823", "Open data"]
];
const creditFor = src => CREDITS.find(c => c[0] === src);

/* ====== research agenda ======
   Each programme: key, title, one-line summary, why it matters, research agenda, SDGs, image, publications it builds on (ids from data/publications.json). */
const PROGRAMMES = [
  { key: "xai-eo", title: "Explainable GeoAI for Earth observation", img: IMG.geo,
    short: "Interpretable AI that turns satellite imagery into accurate, transparent insight for conservation, resource management and climate change adaptation.",
    why: "AI models now map land cover, vegetation and pasture from space with high accuracy, but most are black boxes. Land managers, conservation agencies and policy makers need to know why a model reached its answer, and how far to trust it, before they act on it. Our work on near-real-time satellite analysis of grassland dynamics and vegetation health, from single farms to continental scale, shows both the power of these methods and the need to explain them.",
    agenda: [
      "Interpretable and explainable models for remote sensing: feature attribution, physically meaningful features and uncertainty that users can read",
      "Near-real-time algorithms for satellite image time series that track grassland dynamics and vegetation health",
      "Scaling from farm to continent with label-efficient learning, as in our label-free pasture-type clustering (NMI 86–88%)",
      "A foundational GeoAI model for Nepal's Sustainable Development Goals, pre-trained on multi-sensor imagery of the Terai, hills and mountains",
      "Decision-support tools for environmental conservation, natural resource management and climate change adaptation"
    ],
    sdgs: ["SDG 2 Zero hunger", "SDG 6 Clean water", "SDG 13 Climate action", "SDG 15 Life on land"],
    builds: ["pasture-obia-clustering-2025", "pasture-monitoring-review-2025", "ndvi-fusion-2021", "spatial-deep-learning-2022", "botanicx-ai-2023", "cxr-xai-2022"] },
  { key: "uav", title: "Drones and AI for agriculture", img: IMG.uav,
    short: "Drone imaging and machine learning to improve crop quality and quantity: detecting disease, weeds and water stress, and predicting yield.",
    why: "This programme grows out of the founder's doctoral research. Drones see individual plants, which satellites cannot, but turning their images into decisions on a farm needs methods that are robust, affordable and easy to interpret.",
    agenda: [
      "Disease, weed and water-stress detection from RGB and multispectral drone imagery with deep learning",
      "Yield and severity estimation by combining vegetation indices, as in our cooperative scheme for peanut late leaf spot (R² up to about 0.79)",
      "Linking drone detail with satellite coverage to monitor whole districts and regions",
      "Lightweight, explainable models that run on phones and on-board devices in the field",
      "Open flight and data-collection protocols for smallholder and hill farms in Nepal"
    ],
    sdgs: ["SDG 2 Zero hunger", "SDG 12 Responsible production", "SDG 13 Climate action"],
    builds: ["crop-disease-uav-review-2023", "precision-agri-uav-review-2022", "peanut-lls-2023", "peanut-yield-2023", "weed-detection-uav-2023", "uav-crop-health-2024", "tomato-irrigation-2025"] },
  { key: "multimodal", title: "Multi-modal data intelligence for society", img: IMG.segments,
    short: "Fusing satellite imagery, drone observations and socio-economic indicators for smart cities, disaster management and sustainability planning.",
    why: "No single data source tells the whole story. Satellites show where land is changing, drones show what is happening on the ground, and socio-economic data show who is affected. Bringing them together, with machine learning that can be checked and explained, gives planners a far sharper picture. The same analytical toolkit also serves health and finance.",
    agenda: [
      "Methods to fuse multi-modal data: satellite, drone, field and socio-economic indicators",
      "Smart-city analytics: urban growth, land use and infrastructure from Earth observation",
      "Disaster management: mapping floods and landslides, and linking hazards to exposure and vulnerability",
      "Sustainability planning: SDG indicators that combine Earth observation with household and census data",
      "Explainable machine learning for health imaging and financial forecasting"
    ],
    sdgs: ["SDG 3 Good health", "SDG 8 Decent work and growth", "SDG 11 Sustainable cities", "SDG 13 Climate action"],
    builds: ["ndvi-fusion-2021", "spatial-deep-learning-2022", "cxr-xai-2022", "retinal-disease-cnn-2023", "covid-cxr-bodvw-2021", "stock-forecasting-2020"] },
  { key: "nlp", title: "NLP for low-resource languages", img: IMG.nlp,
    short: "Datasets, models and tools for Nepali and code-mixed Roman Nepali, extending to other languages of Nepal.",
    why: "More than 120 languages are spoken in Nepal, yet even Nepali has few open datasets and models. People write in Devanagari, Roman script and mixtures with English, which standard tools handle poorly. The founder's Nepali NLP work began in 2013 with part-of-speech tagging and now includes NepEMO, an open emotion dataset.",
    agenda: [
      "Open, carefully annotated Nepali datasets and benchmarks, following NepEMO (4,462 posts, five emotions, three sentiment classes)",
      "Small, efficient language models for Nepali and code-mixed text that run without large GPUs",
      "Sentiment, emotion and wellbeing signals from social media, handled ethically and with privacy in mind",
      "Text as a socio-economic data source, linking public sentiment with events such as disasters",
      "Extending resources to other languages of Nepal, such as Maithili and Bhojpuri, with community partners"
    ],
    sdgs: ["SDG 3 Good health", "SDG 4 Quality education", "SDG 10 Reduced inequalities", "SDG 16 Strong institutions"],
    builds: ["nepemo-2025", "nepali-sentiment-hybrid-2025", "nepali-nlp-review-2021", "multichannel-cnn-tweets-2023", "nepali-summarization-2022", "nepali-ner-2014", "nepali-pos-tagging-2013"] }
];

/* Vision: data → algorithms → applications */
const PILLARS = [
  ["layers", "Data", "Complex, multi-modal data: satellite imagery, drone observations, field measurements and socio-economic indicators."],
  ["cpu", "Algorithms", "Intelligent models and analytical systems that are accurate, efficient and interpretable."],
  ["eye", "Insight", "Transparent, understandable explanations that show why a model reached its answer."],
  ["target", "Applications", "Environmental and agricultural monitoring, conservation, climate adaptation, smart cities and disaster management."]
];
const pillarsGrid = () => `<div class="grid g4">${PILLARS.map(([ic, t, d]) => `<div class="value"><div class="ic">${icon[ic]}</div><h3>${t}</h3><p>${d}</p></div>`).join("")}</div>`;

/* Headline results from the founder's papers (all figures as reported in the papers) */
const RESULTS = [
  ["86–88%", "agreement (NMI) when mapping pasture types from Sentinel-2 time series without any labelled training data, over about 2,510 ha", "Remote Sensing, 2025", "pasture-obia-clustering-2025"],
  ["88%", "F1-score for multi-class weed segmentation from UAV images with a UNet–EfficientNetB0 model", "Drones, 2023", "weed-detection-uav-2023"],
  ["0.79", "R² for estimating peanut late leaf spot from UAV multispectral vegetation indices", "PLOS ONE, 2023", "peanut-lls-2023"],
  ["99%", "test accuracy across ten tomato leaf classes, with Grad-CAM and LIME explanations", "Journal of Imaging, 2023", "botanicx-ai-2023"],
  ["4,462", "Nepali Reddit posts manually labelled for five emotions and sentiment, released openly as NepEMO", "arXiv, 2025", "nepemo-2025"],
  ["55", "studies systematically reviewed on UAV and deep learning for crop disease detection", "Remote Sensing, 2023", "crop-disease-uav-review-2023"]
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
  <div class="thumb">${imgTag(esc(p.image))}</div>
  <div class="body"><div class="meta"><span class="tag">${esc(p.category)}</span><span>${fmtDate(p.date)}</span></div>
  <h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><div class="foot"><span class="link">Read more →</span></div></div></a>`;
const dateTile = iso => { if (!iso) return `<div class="date-tile"><b>TBA</b><span>Date</span></div>`; const [y,m,d] = iso.split("-").map(Number); return `<div class="date-tile"><b>${d}</b><span>${MONTHS[m-1]} ${y}</span></div>`; };
const eventRow = e => `<article class="event">${dateTile(e.date)}
  <div><div class="meta" style="font-family:var(--mono);font-size:.74rem;color:var(--muted);margin-bottom:6px"><span class="tag">${esc(e.type)}</span> ${esc(e.location)}${e.time ? " · " + esc(e.time) : ""}</div>
  <h3>${esc(e.title)}</h3><p>${esc(e.description)}</p></div>
  <a class="btn sm" href="${esc(e.registration || "#contact")}" data-svc="Join community updates">${e.date ? "Register" : "Notify me"}</a></article>`;
const FOUNDERS = ["Tej Bahadur Shahi"];
const authorsHtml = a => FOUNDERS.reduce((h, n) => h.split(n).join(`<strong>${n}</strong>`), esc(a));
const pubRow = p => `<article class="pub"><div>
  <h3>${esc(p.title)}</h3><div class="authors">${authorsHtml(p.authors)}</div>
  <div><span class="venue">${esc(p.venue)}</span>, ${p.year} · <span class="tag">${esc(p.type)}</span> ${(p.tags || []).map(t => `<span class="tag red">${esc(t)}</span>`).join(" ")}</div></div>
  <div class="links">${p.doi ? `<a href="https://doi.org/${esc(p.doi)}">DOI</a>` : ""}${p.url ? `<a href="${esc(p.url)}">Link</a>` : ""}${p.pdf ? `<a href="${esc(p.pdf)}">PDF</a>` : ""}${p.code ? `<a href="${esc(p.code)}">Code</a>` : ""}</div></article>`;
const sortByDate = (a, b) => (b.date || "").localeCompare(a.date || "");
const statusClass = st => /complet/i.test(st) ? "done" : /plan|seek/i.test(st) ? "warm" : "";
const projectCard = (p, byId = {}) => `<article class="card project" id="proj-${esc(p.id)}"><div class="thumb">${imgTag(esc(p.image))}</div>
  <div class="body"><div><span class="status ${statusClass(p.stage)}">${esc(p.stage)}</span></div>
  <h3>${esc(p.title)}</h3><div class="meta2">${esc(p.theme)} · ${esc(p.period)}</div><p>${esc(p.summary)}</p>
  <p class="muted" style="font-size:.85rem"><b>Partners:</b> ${esc(p.partners)}</p>
  ${(p.outputs || []).length || (p.links || []).length ? `<ul class="outs">${(p.outputs || []).map(id => byId[id]).filter(Boolean).map(x => `<li><a href="${x.doi ? "https://doi.org/" + esc(x.doi) : esc(x.url || "#publications")}">${esc(x.title)}</a> <span class="muted">(${x.year})</span></li>`).join("")}${(p.links || []).map(([l, u]) => `<li><a href="${esc(u)}">${esc(l)}</a></li>`).join("")}</ul>` : ""}
  </div></article>`;

/* Data & Tools: open resources (add new entries here) */
const TOOLS = [
  ["Dataset", "NepEMO: Nepali emotion and sentiment dataset", "4,462 manually labelled Nepali Reddit posts (2019–2025) with five emotions and three sentiment classes, in English, Roman Nepali, Devanagari and code-mixed text.", "https://github.com/tejshahi/Nepali-Reddit-NepEMO-", "Open on GitHub", "Released"],
  ["Code", "OBIA-clusters: label-free pasture mapping", "Python code for object-based clustering of Sentinel-2 time series to map pasture types without labelled training data.", "https://github.com/tejshahi/OBIA-clusters-v2", "Open on GitHub", "Released"],
  ["Tutorial", "Python for research with real Nepali data", "A step-by-step notebook-style tutorial that loads NepEMO, summarises emotions and plots six years of trends.", "#post-python-for-research-first-steps", "Read the tutorial", "Released"],
  ["Dataset", "Nepal Earth-observation benchmarks", "Labelled benchmark datasets for crop type, rangeland, forest, urban growth, water and hazards across Nepal's landscapes.", "#projects", "See the project", "In development"],
  ["Toolkit", "Explainability toolkit for Earth observation", "Open tools that show which bands, seasons and features drive a model's predictions on satellite and drone imagery.", "#projects", "See the project", "Planned"],
  ["Guide", "Drone flight and data protocols for hill farms", "Simple, open protocols for collecting usable drone imagery on Nepal's smallholder and terraced farms.", "#projects", "See the project", "Planned"]
];

/* Objectives (About page) */
const OBJECTIVES = [
  "Develop accurate, interpretable AI models for satellite imagery, drone observations and socio-economic data.",
  "Deliver insight that is used in environmental conservation, natural resource management, agriculture and climate change adaptation.",
  "Attract national and international research grants and build long-term research partnerships.",
  "Publish in peer-reviewed journals, present at leading forums such as IEEE IGARSS and IEEE ICDM, and brief policy makers.",
  "Release open datasets, code and tools, especially for Nepal and other data-scarce regions.",
  "Train and mentor research students, early-career researchers and professionals through the HIDI Academy."
];


const resultCard = ([n, t, v]) => `<article class="card result"><div class="body"><b class="big">${n}</b><p>${t}</p><span class="muted mono" style="font-size:.78rem">${v}</span></div></article>`;

/* ====== views ====== */
const views = {};

views.home = async () => {
  const [posts, pubs, events] = await Promise.all([getJSON("data/posts.json"), getJSON("data/publications.json"), getJSON("data/events.json")]).catch(() => [[], [], []]);
  const latest = [...posts].sort(sortByDate).slice(0, 3);
  const latestPubs = [...pubs].sort((a, b) => b.year - a.year).slice(0, 3);
  const projects = await getJSON("data/projects.json").catch(() => []);
  const pubById = Object.fromEntries(pubs.map(p => [p.id, p]));
  return `
  <div class="hero"><div class="wrap">
    <div class="hero-text">
      <span class="eyebrow">Not-for-profit institute · Kathmandu, Nepal</span>
      <h1>Explainable AI for Earth observation and society.</h1>
      <p class="lede">HIDI bridges data, algorithms and applications. We build intelligent, interpretable models that turn satellite imagery, drone observations and socio-economic data into insights people can trust and act on, for environmental and agricultural monitoring, conservation, climate adaptation, smart cities and disaster management.</p>
      <div class="actions"><a class="btn primary" href="#research">Explore our research</a><a class="btn" href="#services">Work with us</a></div>
      <div class="stats">
        <div><b>4</b><span>research themes</span></div>
        <div><b>${pubs.length || 40}</b><span>peer-reviewed publications</span></div>
        <div><b>${new Date().getFullYear() - 2013}+</b><span>years of research</span></div>
        <div><b>${new Set(pubs.map(p => p.venue)).size || 38}</b><span>journals and venues</span></div>
      </div>
    </div>
    <div class="hero-img">${imgTag(IMG.hero, "Map of pasture types on a farm, from a study of label-free pasture mapping with Sentinel-2 satellite time series", false)}
      <div class="hero-badge"><b>Earth observation</b><span>Label-free pasture mapping from Sentinel-2 time series (Shahi et al., <i>Remote Sensing</i>, 2025).</span></div></div>
  </div></div>

  <section><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Welcome to HIDI</span><h2>Data intelligence you can trust</h2><p class="lede">The Himalayan Institute for Data Intelligence is an independent, not-for-profit institute in Kathmandu. We specialise in explainable AI: models that are accurate, and that also show why they reached their answer. We put that into practice through research, open data and tools, training and services.</p></div></div>
    <div class="grid g3">
      <a class="highlight" href="#research"><span class="eyebrow">Research</span><b class="big">4</b><h3>Research themes</h3><p class="muted">From explainable GeoAI for Earth observation to Nepali language technology.</p><span class="link">Explore our research →</span></a>
      <a class="highlight" href="#data"><span class="eyebrow">Open science</span><b class="big">${TOOLS.filter(t => t[5] === "Released").length}</b><h3>Open datasets, code and tutorials</h3><p class="muted">Released freely so that others can reuse, check and build on our work.</p><span class="link">Data &amp; Tools →</span></a>
      <a class="highlight" href="#involved"><span class="eyebrow">Get involved</span><b class="big">6</b><h3>Ways to get involved</h3><p class="muted">Research fellows, associates, interns, partners, funders and careers.</p><span class="link">Get involved →</span></a>
    </div>
  </div></section>

  <section class="tint"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Our vision</span><h2>From data to decisions</h2><p class="lede">Our models extract insight from complex, multi-modal data and explain it, so that it can be used directly in conservation, resource management and climate change adaptation.</p></div><a class="link" href="#about">About HIDI →</a></div>
    ${pillarsGrid()}
  </div></section>

  <section><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Research themes</span><h2>Explore our research</h2><p class="lede">Built on more than a decade of published work in remote sensing, machine learning and data analytics, and aimed at problems that matter in Nepal and around the world.</p></div><a class="link" href="#research">Full agenda →</a></div>
    <div class="grid g4">${PROGRAMMES.map((p, i) => `<a class="card" href="#research"><div class="thumb">${imgTag(p.img)}</div><div class="body"><span class="eyebrow">Theme ${String(i + 1).padStart(2, "0")}</span><h3>${p.title}</h3><p>${p.short}</p></div></a>`).join("")}</div>
  </div></section>

  <section class="tint"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Projects</span><h2>Current projects</h2><p class="lede">What we are building now, and where partners can join.</p></div><a class="link" href="#projects">All projects →</a></div>
    <div class="grid g3">${projects.filter(p => p.status === "Current").slice(0, 3).map(p => projectCard(p, pubById)).join("")}</div>
  </div></section>

  <section><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Evidence</span><h2>Selected results</h2><p class="lede">What our recent papers have shown.</p></div><a class="link" href="#publications">All publications →</a></div>
    <div class="grid g3">${RESULTS.slice(0, 3).map(resultCard).join("")}</div>
  </div></section>

  <section class="tint"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">News &amp; events</span><h2>Latest from HIDI</h2></div><a class="link" href="#blog">All posts →</a></div>
    ${latest.length ? `<div class="grid g3">${latest.map(postCard).join("")}</div>` : `<div class="empty">Posts will appear here.</div>`}
  </div></section>

  <section><div class="wrap grid g2" style="gap:48px;align-items:start">
    <div><div class="sec-head" style="margin-bottom:12px"><div><span class="eyebrow">Publications</span><h2>Recent publications</h2></div><a class="link" href="#publications">All →</a></div>
      ${latestPubs.map(pubRow).join("")}</div>
    <div><div class="sec-head" style="margin-bottom:20px"><div><span class="eyebrow">Events</span><h2>Coming up</h2></div><a class="link" href="#events">All →</a></div>
      <div class="stack" style="gap:14px">${events.slice(0, 3).map(eventRow).join("")}</div></div>
  </div></section>

  <section class="tint"><div class="wrap feature">
    ${imgTag(IMG.uav, "Drone image of cotton rows with weeds between them")}
    <div class="txt"><span class="eyebrow">How we're funded</span><h2>Every fee supports open research</h2>
      <p class="lede">HIDI does not distribute profit. Grants, partnerships, philanthropy, and income from fair-priced services and training all go back into research, scholarships and community programmes.</p>
      <div class="actions"><a class="btn dark" href="#support">Support HIDI</a><a class="btn" href="#services">See our services</a></div></div>
  </div></section>
  ${ctaBand()}`;
};

views.research = async () => {
  const pubs = await getJSON("data/publications.json").catch(() => []);
  const byId = Object.fromEntries(pubs.map(p => [p.id, p]));
  const cite = id => { const p = byId[id]; if (!p) return ""; const href = p.doi ? `https://doi.org/${esc(p.doi)}` : esc(p.url || "#publications");
    return `<li><a href="${href}">${esc(p.title)}</a> <span class="muted">(${esc(p.venue.replace(/ \(.*\)$/, ""))}, ${p.year})</span></li>`; };
  const figCap = src => { const c = creditFor(src); return c ? `<figcaption>${esc(c[1])} <span class="muted">Source: ${esc(c[2])}.</span></figcaption>` : ""; };
  return `
  ${pageHero({ img: IMG.segments, eyebrow: "Research", title: "Research agenda", crumb: "Research",
    lede: "Four research themes that bridge data, algorithms and applications. Our flagship is explainable GeoAI for Earth observation, including a foundational GeoAI model for Nepal's Sustainable Development Goals.",
    actions: `<a class="btn primary" href="#contact" data-svc="Research partnership">Propose a collaboration</a><a class="btn" href="#projects">Projects</a><a class="btn" href="#data">Data &amp; Tools</a>` })}
  <section><div class="wrap stack" style="gap:72px">
    ${PROGRAMMES.map((p, i) => `<div class="feature prog" id="prog-${p.key}">
      <figure class="${i % 2 ? "flip" : ""}">${imgTag(p.img, p.title)}${figCap(p.img)}</figure>
      <div class="txt"><span class="eyebrow">Theme ${String(i + 1).padStart(2, "0")}${i === 0 ? " · Flagship" : ""}</span><h2>${p.title}</h2>
        <p class="lede">${p.short}</p><p>${p.why}</p>
        <h3 class="sub">Research agenda</h3>${ticks(p.agenda)}
        <div class="chips">${p.sdgs.map(x => `<span class="chip sdg">${x}</span>`).join("")}</div>
        <details class="builds"><summary>Builds on ${p.builds.length} of our publications</summary><ul>${p.builds.map(cite).join("")}</ul></details>
      </div></div>`).join("")}
  </div></section>
  <section class="tint"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Evidence</span><h2>Selected results</h2><p class="lede">Headline findings from our papers, as reported by the authors.</p></div></div>
    <div class="grid g3">${RESULTS.map(resultCard).join("")}</div>
  </div></section>
  <section><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Outputs</span><h2>What our research produces</h2><p class="lede">We share results with the national and international research community and with decision-makers.</p></div></div>
    <div class="chips">${["Peer-reviewed journal papers","Talks at international forums such as IEEE IGARSS and IEEE ICDM","Policy briefings","Open datasets, such as NepEMO","Open-source code on GitHub","Maps and SDG indicators","Training material and tutorials"].map(x => `<span class="chip">${x}</span>`).join("")}</div>
  </div></section>
  <section class="tint"><div class="wrap"><div class="callout"><b>Image credits.</b> Figures on this site come from the founder's open-access papers and open data. <a class="link" href="#data">See all figures and credits →</a></div></div></section>
  ${ctaBand("Partner with us on research", "Universities, NGOs, government agencies and funders: let's design a project together.", "Propose a collaboration")}`;
};

views.publications = async () => {
  const pubs = await getJSON("data/publications.json").catch(() => []);
  const years = [...new Set(pubs.map(p => p.year))].sort((a, b) => b - a);
  const types = [...new Set(pubs.map(p => p.type))];
  const tags = [...new Set(pubs.flatMap(p => p.tags || []))].sort();
  return {
    html: `${pageHero({ img: IMG.leaves, eyebrow: "Publications", title: "Publications", crumb: "Publications", lede: "Peer-reviewed work by founder Dr Tej Bahadur Shahi and collaborators since 2013, in remote sensing, machine learning and data analytics. Dr Shahi's name is in bold." })}
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
    html: `${pageHero({ img: IMG.uav, eyebrow: "Blog & news", title: "Blog", crumb: "Blog", lede: "News, research stories and tutorials from HIDI." })}
    <section><div class="wrap">
      ${featured ? `<a class="card" href="#post-${esc(featured.slug)}" style="display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);margin-bottom:40px" id="featured">
        <div class="thumb" style="aspect-ratio:auto;min-height:260px">${imgTag(esc(featured.image), "", false)}</div>
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
  document.title = `${p.title} · HIDI`;
  return `<div class="page-hero"><img src="${esc(p.image)}" alt=""><div class="wrap">
      <div class="crumbs"><a href="#home">Home</a> / <a href="#blog">Blog</a> / ${esc(p.category)}</div>
      <h1 style="max-width:22ch">${esc(p.title)}</h1>
      <div class="post-meta"><span>${fmtDate(p.date)}</span><span>·</span><span>${esc(p.author)}</span><span>·</span><span>${esc(p.category)}</span></div></div></div>
    <section><div class="wrap"><article class="prose">${body}</article>
      <div class="author-box"><img src="assets/img/founder.png" alt=""><div><strong>${esc(p.author)}</strong><p class="muted" style="font-size:.9rem">Founder and Director, HIDI</p></div></div>
    </div></section>
    ${related.length ? `<section class="tint"><div class="wrap"><div class="sec-head"><div><h2>More from the blog</h2></div><a class="link" href="#blog">All posts →</a></div><div class="grid g3">${related.map(postCard).join("")}</div></div></section>` : ""}`;
};

views.events = async () => {
  const events = (await getJSON("data/events.json").catch(() => []));
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter(e => !e.date || e.date >= today).sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
  const past = events.filter(e => e.date && e.date < today).sort(sortByDate);
  return `${pageHero({ img: IMG.weeds, eyebrow: "Events & community", title: "Events and community", crumb: "Events",
      lede: "Seminars, workshops, training cohorts and mentoring that connect Nepal's AI and data science community, from GeoAI to Nepali language technology.",
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
        ${svcCard("Research internships", "Mentored research for talented undergraduates.", ["Real HIDI projects", "Co-authorship where merited"], '<span class="lbl">Status</span>Expressions of interest open')}
        ${svcCard("Open resources", "Free tutorials, notebooks and datasets.", ["NepEMO Nepali emotion dataset (released)", "Pasture-clustering code on GitHub (released)", "Python tutorials using real Nepali data"], '<span class="lbl">Status</span>Growing')}
      </div>
    </div></section>
    ${ctaBand("Speak, host or volunteer", "Want to give a talk, host a workshop or join as a student intern? Let us know.", "Get involved")}`;
};

views.projects = async () => {
  const [projects, pubs] = await Promise.all([getJSON("data/projects.json"), getJSON("data/publications.json")]).catch(() => [[], []]);
  const byId = Object.fromEntries(pubs.map(p => [p.id, p]));
  const cur = projects.filter(p => p.status === "Current"), done = projects.filter(p => p.status !== "Current");
  return `${pageHero({ img: IMG.geo, eyebrow: "Projects", title: "Projects", crumb: "Projects",
      lede: "Current HIDI projects, and the completed research by our founder that they build on.",
      actions: `<a class="btn primary" href="#contact" data-svc="Research partnership">Partner on a project</a><a class="btn" href="#research">Research themes</a>` })}
    <section><div class="wrap">
      <div class="sec-head"><div><span class="eyebrow">Current</span><h2>Current projects</h2><p class="lede">In development or seeking partners and funding. Each status label says where a project stands.</p></div></div>
      <div class="grid g3">${cur.map(p => projectCard(p, byId)).join("")}</div>
    </div></section>
    <section class="tint"><div class="wrap">
      <div class="sec-head"><div><span class="eyebrow">Completed</span><h2>Completed projects</h2><p class="lede">Research completed by the founder and collaborators, with the papers, data and code it produced.</p></div></div>
      <div class="grid g3">${done.map(p => projectCard(p, byId)).join("")}</div>
    </div></section>
    ${ctaBand("Have a project in mind?", "We work with universities, agencies, NGOs and industry on joint projects and grant applications.", "Propose a project")}`;
};

views.data = async () => `
  ${pageHero({ img: IMG.nlp, eyebrow: "Data & Tools", title: "Open data, code and tools", crumb: "Data &amp; Tools",
    lede: "Open science is central to HIDI. We release datasets, code, tutorials and maps so that others can reuse, check and build on our work." })}
  <section><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Resources</span><h2>Datasets, code and tutorials</h2></div></div>
    <div class="grid g3">${TOOLS.map(([kind, t, d, url, label, st]) => `<article class="card tool"><div class="body"><div><span class="status ${statusClass(st)}">${kind} · ${st}</span></div><h3>${t}</h3><p>${d}</p><div class="foot"><a class="link" href="${url}">${label} →</a></div></div></article>`).join("")}</div>
  </div></section>
  <section class="tint" id="credits"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Maps &amp; visualisations</span><h2>Figures from our research</h2><p class="lede">Every image on this website comes from the founder's research: figures from open-access papers, reused under their Creative Commons licences, and charts we made from open data.</p></div></div>
    <div class="gallery">${CREDITS.map(([src, cap, srcTxt, doi, lic]) => `<figure>${imgTag(src, cap)}<figcaption><b>${esc(cap)}</b>${esc(srcTxt)}. <a href="https://doi.org/${esc(doi)}">doi:${esc(doi)}</a> · ${lic}</figcaption></figure>`).join("")}</div>
  </div></section>
  ${ctaBand("Want to use or contribute data?", "Tell us about your dataset, your use case or a tool you'd like to see.", "Contact us")}`;

views.news = async () => {
  const [posts, events] = await Promise.all([getJSON("data/posts.json"), getJSON("data/events.json")]).catch(() => [[], []]);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter(e => !e.date || e.date >= today).slice(0, 4);
  return `${pageHero({ img: IMG.uav, eyebrow: "News & Events", title: "News and events", crumb: "News &amp; Events",
      lede: "Research stories, tutorials, seminars, workshops and training from HIDI.",
      actions: `<a class="btn primary" href="#contact" data-svc="Join community updates">Get updates</a>` })}
    <section><div class="wrap">
      <div class="sec-head"><div><span class="eyebrow">Latest</span><h2>News and stories</h2></div><a class="link" href="#blog">Search all posts →</a></div>
      <div class="grid g3">${[...posts].sort(sortByDate).map(postCard).join("")}</div>
    </div></section>
    <section class="tint"><div class="wrap">
      <div class="sec-head"><div><span class="eyebrow">Events</span><h2>Upcoming events</h2></div><a class="link" href="#events">All events and community programmes →</a></div>
      <div class="stack" style="gap:14px">${upcoming.length ? upcoming.map(eventRow).join("") : `<div class="empty">No upcoming events yet.</div>`}</div>
    </div></section>${ctaBand("Speak, host or volunteer", "Want to give a talk, host a workshop or join as a student intern? Let us know.", "Get involved")}`;
};

views.involved = async () => `
  ${pageHero({ img: IMG.hero, eyebrow: "Get involved", title: "Join HIDI", crumb: "Get involved",
    lede: "HIDI is growing. We welcome researchers, students, partners and funders who share our goal of trustworthy AI for the environment and society.",
    actions: `<a class="btn primary" href="#contact" data-svc="Research partnership">Express interest</a><a class="btn" href="#contact">Contact us</a>` })}
  <section><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">People</span><h2>Roles at HIDI</h2><p class="lede">Our people are organised in the roles below. As the team grows, members will be listed on the About page.</p></div></div>
    <div class="grid g3 role-grid">
      ${svcCard("Research Fellows", "Experienced researchers who lead projects, co-supervise students and co-author grant applications with HIDI.", ["PhD in a related field", "Track record of peer-reviewed publications", "Can be based in Nepal or abroad"], '<span class="lbl">Status</span>Expressions of interest open')}
      ${svcCard("Research Associates", "Early-career researchers and professionals who contribute to projects, analysis and publications.", ["Master's or PhD candidates and graduates", "Skills in Python, remote sensing, ML or NLP", "Part-time or project-based"], '<span class="lbl">Status</span>Expressions of interest open')}
      ${svcCard("Research Interns", "Mentored research experience for talented undergraduate and master's students.", ["Real HIDI projects", "Co-authorship where merited", "Online or in Kathmandu"], '<span class="lbl">Status</span>Expressions of interest open')}
      ${svcCard("Research partners", "Universities, government agencies, NGOs and industry who co-design projects and grant applications with us.", ["Joint projects and grants", "Data and field partnerships", "Student exchange and co-supervision"], '<span class="lbl">How</span>Propose a partnership')}
      ${svcCard("Funders and supporters", "Foundations, agencies and individuals who fund research, scholarships and open resources.", ["Project and programme funding", "Academy scholarships", "Event sponsorship"], '<span class="lbl">How</span><a class="link" href="#support">Support HIDI →</a>')}
      ${svcCard("Careers", "Paid positions will be advertised here as funded projects begin.", ["Postdoctoral researchers", "Research assistants", "Data scientists and engineers"], '<span class="lbl">Status</span>No vacancies at present')}
    </div>
  </div></section>${ctaBand("Interested in joining?", "Send a short note about your background and interests, with a CV or publication list.", "Express interest")}`;

views.academy = async () => views.training();

views.training = async () => `
  ${pageHero({ img: IMG.trends, eyebrow: "HIDI Academy", title: "Small cohorts, live teaching, real projects", crumb: "Academy",
    lede: "Each course combines live sessions, practical assignments and a final mini-project, online or in person. Participants who complete receive a HIDI certificate.",
    actions: `<a class="btn primary" href="#contact" data-svc="Training course">Register interest</a>` })}
  <section><div class="wrap stack">
    <div class="grid g3">${COURSES.map(([t, m, list, fee]) => `<article class="card svc"><div class="body"><span class="eyebrow">${m}</span><h3>${t}</h3>${ticks(list)}<div class="fee price-big">${price(fee)}<span class="muted" style="font-size:.8rem;display:block">per participant</span></div></div></article>`).join("")}
      <article class="card svc" style="background:var(--sunk)"><div class="body"><span class="eyebrow">For universities</span><h3>Custom training for your institution</h3><p>Any course can be delivered as a workshop or programme for your faculty and students, with partner discounts.</p><div class="foot"><a class="link" href="#institutions">Institutional training →</a></div></div></article></div>
    <div class="chips">${["10–15 participants per online cohort","10–12 per in-person cohort","Certificate of completion","Limited scholarships","Reduced fees for university partners"].map(x => `<span class="chip">${x}</span>`).join("")}</div>
  </div></section>
  ${ctaBand("Join the next cohort", "Register your interest and we'll tell you when enrolment opens.", "Register interest")}`;

views.services = async () => `
  ${pageHero({ img: IMG.geo, eyebrow: "Research & advisory services", title: "Expert support that funds independent research", crumb: "Services",
    lede: "Services are delivered by Dr Shahi and HIDI associates. Prices are in NPR for clients in Nepal, with the international price in brackets." })}
  <section><div class="wrap">
    <div class="sec-head"><div><h2>Who we work with</h2></div></div>
    <div class="grid g3">
      <a class="card" href="#researchers"><div class="thumb">${imgTag(IMG.trends)}</div><div class="body"><span class="eyebrow">For</span><h3>Researchers &amp; students</h3><p>Plan, analyse and publish strong research.</p><span class="link foot">Explore →</span></div></a>
      <a class="card" href="#institutions"><div class="thumb">${imgTag(IMG.leaves)}</div><div class="body"><span class="eyebrow">For</span><h3>Universities &amp; institutions</h3><p>Training and capacity building for stronger research outputs.</p><span class="link foot">Explore →</span></div></a>
      <a class="card" href="#organisations"><div class="thumb">${imgTag(IMG.segments)}</div><div class="body"><span class="eyebrow">For</span><h3>NGOs, INGOs &amp; agencies</h3><p>Evaluation, data science, GIS and AI advice.</p><span class="link foot">Explore →</span></div></a>
    </div>
  </div></section>
  <section class="tint"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Start here</span><h2>Launch packages</h2><p class="lede">Six fixed-price packages. Larger work receives an individual quotation.</p></div></div>
    <div class="grid g3">${PACKS.map(([k, t, fee, d, suf]) => `<article class="card svc"><div class="body"><span class="eyebrow">${k}</span><h3>${t}</h3><p>${d}</p><div class="fee price-big">${price(fee, suf)}</div><a class="link" href="#contact" data-svc="${t}">Enquire →</a></div></article>`).join("")}</div>
  </div></section>
  ${ctaBand("Not sure what you need?", "Book a free 15-minute suitability call and we'll point you to the right service.", "Book a free call")}`;

views.researchers = async () => `
  ${pageHero({ img: IMG.trends, eyebrow: "Services for researchers", title: "Helping researchers produce work they can publish with confidence", crumb: `<a href="#services">Services</a> / Researchers`,
    lede: "For postgraduate students, early-career academics and research teams.", actions: `<a class="btn primary" href="#contact" data-svc="Research consultation">Request a quote</a>` })}
  <section><div class="wrap stack">
    <div class="grid g2">${RESEARCHER_SVC.map(([n, d, l, f, s]) => svcCard(n, d, l, price(f, s))).join("")}
      ${svcCard("Bespoke services", "Larger or unusual projects, scoped with you.", ["Research communication", "Grant writing support and review", "Multi-stage or team projects"], '<span class="lbl">Fee</span>Personalised quote')}</div>
    <div class="callout"><b>Your research stays yours.</b> We mentor, advise, edit and support analysis. We do not write theses or manuscripts on anyone's behalf. Ownership, data integrity and authorship remain with the researcher.</div>
  </div></section>${ctaBand()}`;

views.institutions = async () => `
  ${pageHero({ img: IMG.leaves, eyebrow: "Services for institutions", title: "Training and support that strengthens research capacity", crumb: `<a href="#services">Services</a> / Institutions`,
    lede: "For universities, colleges, research centres and academic departments.", actions: `<a class="btn primary" href="#contact" data-svc="Institutional workshop or programme">Request a quote</a>` })}
  <section><div class="wrap stack">
    <div class="grid g3">${INST_SVC.map(([n, d, l]) => svcCard(n, d, l, '<span class="lbl">Fee</span>See table below')).join("")}</div>
    <div><h2 style="margin-bottom:16px">Institutional fees</h2>
      <div class="table-wrap"><table><thead><tr><th>Service</th><th class="price">Fee</th></tr></thead><tbody>${INST_FEES.map(([n, f]) => `<tr><td>${n}</td><td class="price">${price(f)}</td></tr>`).join("")}</tbody></table></div>
      <p class="note" style="margin-top:12px">Travel, accommodation, venue and other direct costs are charged separately. Partner universities receive a 10–15% discount where viable.</p></div>
  </div></section>${ctaBand()}`;

views.organisations = async () => `
  ${pageHero({ img: IMG.segments, eyebrow: "Services for organisations", title: "A technical research and data science partner", crumb: `<a href="#services">Services</a> / Organisations`,
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
  ${pageHero({ img: IMG.geo, eyebrow: "Support us", title: "Help build research capacity in Nepal", crumb: "Support us",
    lede: "Partners and supporters make our independent research, scholarships and community programmes possible.", actions: `<a class="btn primary" href="#contact" data-svc="Partnership or support">Talk to us</a>` })}
  <section><div class="wrap grid g2">
    ${svcCard("Research partnership", "Joint research projects and grant applications.", ["Universities and research centres", "NGOs and INGOs with research needs", "International collaborators and funders"], '<span class="lbl">How</span>Propose a project')}
    ${svcCard("Fund a scholarship", "Cover training places for students who cannot afford the fee.", ["Python, ML and geospatial AI courses", "Priority for students outside Kathmandu", "Reports on who you supported"], '<span class="lbl">How</span>Sponsor one or more places')}
    ${svcCard("Sponsor an event", "Support our seminars and annual workshop.", ["Recognition at the event and online", "Meet researchers and students", "Keep events open and low-cost"], '<span class="lbl">How</span>Contact us for options')}
    ${svcCard("Donate", "General support for open research and community programmes.", ["Funds research where it's most needed", "Transparent reporting on how gifts are used", "Details once registration is complete"], '<span class="lbl">Status</span>Coming soon')}
  </div></section>${ctaBand("Let's talk about partnership", "Tell us what you'd like to support and we'll suggest options.", "Contact us")}`;

views.about = async () => `
  ${pageHero({ img: IMG.segments, eyebrow: "About", title: "About HIDI", crumb: "About",
    lede: "The Himalayan Institute for Data Intelligence is an independent, not-for-profit, multidisciplinary institute advancing data science and artificial intelligence for societal impact. Founded by Dr Tej Bahadur Shahi, rooted in Nepal and working with partners worldwide." })}
  <section><div class="wrap feature">
    <div class="txt"><span class="eyebrow">Vision</span><h2>Bridging data, algorithms and applications</h2>
      <p class="lede">Our vision is AI that the people who manage land, water, food and cities can understand and trust.</p>
      <p>HIDI develops intelligent models and analytical systems that extract insight from complex, multi-modal data, such as satellite imagery, drone observations and socio-economic indicators. This integrated approach sharpens environmental and agricultural monitoring, and reaches into smart cities, disaster management and sustainability planning.</p>
      <p>Our models must do more than predict accurately. We build AI that offers transparent, understandable explanations, so that its results can be used directly in environmental conservation, natural resource management and climate change adaptation.</p>
      <p class="muted">We are being established as a not-for-profit organisation. All service and training income is reinvested in research, scholarships and community programmes.</p></div>
    ${imgTag(IMG.hero, "Pasture-type map from satellite time series")}
  </div></section>
  <section class="tint"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Mission</span><h2>Our mission</h2><p class="lede">To develop intelligent, interpretable models and analytical systems that turn complex, multi-modal data into insight for the environment and society, and to share that capability openly through publications, data, tools and training.</p></div></div>
    ${pillarsGrid()}
  </div></section>
  <section><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Objectives</span><h2>What we aim to do</h2></div></div>
    <ol class="objectives">${OBJECTIVES.map(o => `<li>${o}</li>`).join("")}</ol>
  </div></section>
  <section><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Impact</span><h2>How we create impact</h2></div></div>
    <div class="grid g2">
      ${svcCard("Research funding", "We seek national and international research grants in our areas of expertise, alone and with university, government and industry partners.", ["Joint grant applications", "Funded research projects"], '<span class="lbl">Partners</span>Universities, agencies, foundations')}
      ${svcCard("Dissemination", "We publish in peer-reviewed journals, present at leading international forums such as IEEE IGARSS and IEEE ICDM, and brief policy makers.", ["Peer-reviewed publications", "Policy briefings", "Open data and code"], '<span class="lbl">Audience</span>Researchers and decision-makers')}
      ${svcCard("A collaborative team", "Research students, postdoctoral researchers and faculty members work together on shared projects, so that each learns from the others.", ["Research student supervision", "Postdoctoral and visiting researchers"], '<span class="lbl">Join</span>Students and researchers')}
      ${svcCard("International visibility", "Through collaboration and publication, we raise the profile of research from Nepal in spatial data science and machine learning.", ["International collaborations", "Co-authored research"], '<span class="lbl">Focus</span>Spatial data science and ML')}
    </div>
  </div></section>
  <section class="tint"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Values</span><h2>What we stand for</h2></div></div>
    <div class="grid g4">
      <div class="value"><div class="ic">${icon.eye}</div><h3>Transparency</h3><p>AI that explains its answers, and methods that others can check.</p></div>
      <div class="value"><div class="ic">${icon.open}</div><h3>Open science</h3><p>We share data, code and findings openly where we can.</p></div>
      <div class="value"><div class="ic">${icon.pin}</div><h3>Real-world relevance</h3><p>We work on problems that matter in Nepal and around the world.</p></div>
      <div class="value"><div class="ic">${icon.shield}</div><h3>Research integrity</h3><p>Ownership, authorship and data integrity stay with researchers.</p></div>
    </div>
  </div></section>
  <section><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">People</span><h2>Founder and Director</h2></div></div>
    <div class="profile">
      <img src="assets/img/founder.png" alt="Dr Tej Bahadur Shahi">
      <div class="stack" style="gap:16px">
        <div><h3 style="font-size:1.6rem">Dr Tej Bahadur Shahi</h3><p class="muted">Founder and Director · PhD, Central Queensland University</p></div>
        <p>Dr Shahi is a computer scientist working at the meeting point of remote sensing, machine learning and data analytics. His PhD applied drones and AI to improve crop quality and quantity, and his research has applied machine learning across agriculture, health and finance. More recently he has worked with large-scale remote sensing data for continental-scale grassland monitoring.</p>
        <p>During his postdoctoral fellowship at Queensland University of Technology (QUT), he developed novel algorithms for the real-time analysis of satellite imagery to track grassland dynamics and vegetation health. He works closely with interdisciplinary teams, bridging data science, AI and environmental science to deliver actionable insights for vegetation monitoring.</p>
        <p>His current goal is interpretable and explainable AI for remote sensing and Earth observation: systems that give accurate predictions together with transparent, understandable insight for environmental conservation, resource management and climate change adaptation.</p>
        <dl class="facts">
          <div><dt>Research areas</dt><dd>Explainable AI for remote sensing and Earth observation; satellite time series and vegetation monitoring; drone remote sensing for agriculture; machine learning for agriculture, health and finance; Nepali language technology</dd></div>
          <div><dt>Published in</dt><dd>Remote Sensing, IEEE Transactions on Artificial Intelligence, Artificial Intelligence Review, Computers in Biology and Medicine, Scientific Reports, PLOS ONE, Drones, Journal of Imaging</dd></div>
          <div><dt>Teaching</dt><dd>Extensive teaching across levels of education, including 7+ years as Assistant Professor of Computer Science at Tribhuvan University; research student supervision</dd></div>
          <div><dt>Earlier career</dt><dd>4+ years as an Information Technology Officer with the Government of Nepal</dd></div>
        </dl>
        <div class="actions"><a class="btn sm" href="https://tejshahi.github.io/publications">Full publication list</a><a class="btn sm" href="https://github.com/tejshahi">GitHub</a><a class="btn sm" href="#publications">HIDI publications</a></div>
      </div>
    </div>
    <div class="callout" style="margin-top:40px"><b>Our team is growing.</b> Research Fellows, Research Associates and Interns will be listed here as they join. <a class="link" href="#involved">See roles and get involved →</a></div>
  </div></section>
  <section class="tint"><div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Terms</span><h2>How we work</h2></div></div>
    <ol class="terms">${["Your first 15-minute suitability call is free. Substantive technical advice is charged.","Project work is billed 50% upfront, with the balance on agreed milestones.","Prices in NPR apply to clients in Nepal. Prices in brackets apply to clients abroad and are billed in US dollars.","10–15% discount for student groups and university partners, where viable.","Fieldwork, travel, software, cloud computing and data acquisition are quoted separately.","Limited subsidised places for students who cannot afford the full fee.","Every engagement has a written agreement covering deliverables, timelines, revisions, confidentiality and intellectual property.","All service and training income is reinvested in the Institute's research and community programmes."].map(t => `<li><span>${t}</span></li>`).join("")}</ol>
  </div></section>${ctaBand()}`;

let pendingService = "";
views.contact = async () => ({
  html: `${pageHero({ img: IMG.hero, eyebrow: "Contact", title: "Get in touch", crumb: "Contact", lede: "Start with a free 15-minute suitability call. We'll reply with next steps and, for project work, a written quotation." })}
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
            body: JSON.stringify({ access_key: CONFIG.web3formsKey, subject, from_name: "HIDI website", name: v("f-name"), email: v("f-email"), country: v("f-country"), client_type: v("f-type"), service: v("f-service"), message: v("f-msg") }) });
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
const TITLES = { home: "HIDI Lab · Himalayan Institute for Data Intelligence", about: "About", research: "Research", projects: "Projects", publications: "Publications", data: "Data & Tools", academy: "Academy", training: "Academy", news: "News & Events", blog: "News", events: "Events", services: "Services", researchers: "For researchers", institutions: "For institutions", organisations: "For organisations", support: "Support HIDI", involved: "Get involved", contact: "Contact" };
const NAV_PARENT = { researchers: "services", institutions: "services", organisations: "services", support: "about", involved: "about", projects: "research", data: "research", academy: "training", news: "blog" };
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
  if (!h.startsWith("post-")) document.title = h === "home" ? TITLES.home : `${TITLES[h] || "Not found"} · HIDI`;
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
