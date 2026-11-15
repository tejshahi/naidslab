# HIDI Lab Website: User Manual

How to update the HIDI Lab website yourself, with worked examples you can copy. HIDI Lab is the **Himalayan Institute for Data Intelligence**.

- **Website:** https://tejshahi.github.io/naidslab/ (later https://hidi.org)
- **Repository:** https://github.com/tejshahi/naidslab (the repository keeps its original name, `naidslab`)
- **Last updated:** November 2026

---

## Contents

1. [How the website works](#1-how-the-website-works)
2. [Two ways to edit](#2-two-ways-to-edit)
3. [Add a blog post](#3-add-a-blog-post)
4. [Edit or delete a blog post](#4-edit-or-delete-a-blog-post)
5. [Add a publication](#5-add-a-publication)
6. [Add an event](#6-add-an-event)
7. [Add or update a project](#7-add-or-update-a-project)
8. [Update the Data & Tools page](#8-update-the-data--tools-page)
9. [Add or replace images](#9-add-or-replace-images)
10. [Change page text, research themes, services and prices](#10-change-page-text-research-themes-services-and-prices)
11. [Menu, footer and website settings](#11-menu-footer-and-website-settings)
12. [JSON rules (read this before editing data files)](#12-json-rules)
13. [Markdown cheat sheet for blog posts](#13-markdown-cheat-sheet)
14. [Check your changes and fix mistakes](#14-check-your-changes-and-fix-mistakes)
15. [What not to publish](#15-what-not-to-publish)
16. [Quick checklists](#16-quick-checklists)

---

## 1. How the website works

The site is a set of plain files. GitHub Pages publishes whatever is in the repository, usually within 1–2 minutes of a change. There is no database and no login to a content system: you change a file, commit it, and the site updates.

```
naidslab/
├── index.html                 Page shell: header menu, logo and footer
├── preview.bat                Double-click to preview the site on your computer
├── README.md                  Short technical notes
├── CONTENT-MANUAL.md          This manual
├── assets/
│   ├── css/style.css          Colours, fonts and layout (rarely edited)
│   ├── js/app.js              Page text, research themes, services, prices, settings
│   └── img/
│       ├── founder.png        Dr Shahi's portrait
│       ├── favicon.svg        The small icon in the browser tab
│       └── research/          The figures and charts used on the pages
├── data/
│   ├── posts.json             List of blog posts
│   ├── publications.json      List of publications
│   ├── events.json            List of events
│   └── projects.json          List of projects (current and completed)
└── posts/
    └── <slug>.md              The text of each blog post
```

**Most of the time you only touch these:**

| You want to… | Files to edit |
|---|---|
| Publish a blog post | Upload an image → create `posts/<slug>.md` → add an entry to `data/posts.json` |
| Add a publication | `data/publications.json` |
| Add an event | `data/events.json` |
| Add or update a project | `data/projects.json` |
| Add a dataset, code or tool | `const TOOLS` in `assets/js/app.js` |
| Change text, research themes, prices, courses or the biography | `assets/js/app.js` |
| Change the menu or footer | `index.html` |
| Change the email address or turn on the contact form | `const CONFIG` at the top of `assets/js/app.js` |

Posts, publications, events and projects are sorted automatically: posts by date (newest first), publications by year, and events by date. It doesn't matter where in the file you add a new entry; adding it at the top is simply easiest.

### The pages

| Page | Address | Where its content comes from |
|---|---|---|
| Home | `#home` | `views.home` in `app.js`, plus the latest posts, projects, publications and events |
| Research | `#research` | `const PROGRAMMES` and `const RESULTS` in `app.js` |
| Projects | `#projects` | `data/projects.json` |
| Publications | `#publications` | `data/publications.json` |
| Data & Tools | `#data` | `const TOOLS` and `const CREDITS` in `app.js` |
| Blog | `#blog` | `data/posts.json` and `posts/*.md` |
| Events | `#events` | `data/events.json` |
| Training | `#training` | `const COURSES` in `app.js` |
| Services | `#services`, `#researchers`, `#institutions`, `#organisations` | `const PACKS`, `RESEARCHER_SVC`, `INST_SVC`, `INST_FEES`, `ORG_FEES` in `app.js` |
| About | `#about` | `views.about` and `const OBJECTIVES` in `app.js` |
| Get involved | `#involved` | `views.involved` in `app.js` |
| Support | `#support` | `views.support` in `app.js` |
| Contact | `#contact` | `views.contact` in `app.js` |

Projects, Data & Tools and Get involved are not in the top menu. Visitors reach them from buttons on the Research and Home pages and from the footer.

---

## 2. Two ways to edit

### Option A: in the browser on github.com (recommended)

You don't need to install anything.

**To edit an existing file:**
1. Go to https://github.com/tejshahi/naidslab and sign in as **tejshahi**.
2. Click through to the file, for example `data` → `events.json`.
3. Click the **pencil icon** ("Edit this file") at the top right of the file.
4. Make your change.
5. Click the green **Commit changes…** button.
6. Write a short message such as `Add seminar event`, then click **Commit changes**.

**To create a new file:**
1. Open the folder, for example `posts`.
2. Click **Add file → Create new file**.
3. Type the file name, for example `field-trip-jumla.md`, write the content and commit.

**To upload images or other files:**
1. Open the folder, for example `assets/img/research`.
2. Click **Add file → Upload files**, drag the files in, and commit.

**To delete a file:** open it, click the **⋯** menu at the top right, choose **Delete file**, and commit.

### Option B: on your computer with Command Prompt

Use this if you edit the files in your local folder (for example in VS Code or Notepad).

**Every time, before you start**, open Command Prompt in the website folder and fetch the latest version, including any edits made on github.com:

```cmd
cd "C:\Users\Tej Shahi\OneDrive - Queensland University of Technology\Arjun-2023\naidslab-website"
git pull
```

Edit the files. Then double-click `preview.bat` to check your changes (see [section 14](#14-check-your-changes-and-fix-mistakes)). When you're happy, send the changes to GitHub:

```cmd
git add .
git commit -m "Add field trip blog post"
git push
```

> **Tip:** Always run `git pull` first. If you skip it after editing on github.com, the push will be refused. If that happens, run `git pull`, then `git push` again.

---

## 3. Add a blog post

A blog post has three parts, linked by the **slug**: a short, lowercase name with hyphens and no spaces, such as `field-trip-jumla`.

| Part | Where it goes | Example |
|---|---|---|
| Cover image | `assets/img/research/` | `assets/img/research/field-trip-jumla.jpg` |
| Post text | `posts/` | `posts/field-trip-jumla.md` |
| Listing entry | `data/posts.json` | title, date, category, summary |

### Worked example: "Field trip to Jumla"

#### Step 1. Upload the cover image

1. Prepare a landscape image about **1200 × 750 pixels**, under about 500 KB. You can shrink it at https://squoosh.app.
2. Name it after the slug: `field-trip-jumla.jpg` (lowercase, no spaces).
3. Upload it to `assets/img/research/` and commit.

#### Step 2. Write the post text

Create `posts/field-trip-jumla.md` and paste in your text, for example:

```markdown
In November, the HIDI Lab team visited **Jumla** to collect ground-truth data
for our explainable GeoAI research. Field samples like these let us check what
satellite images are telling us about crops and pastures.

## What we did

- Recorded crop types at 120 GPS-tagged field plots
- Took drone images over three apple orchards
- Met farmers and the local agriculture office to discuss their data needs

## Why it matters

Satellite models trained on plains data often fail in mountain districts.
Local field data helps us build models that work in Nepal's hills and mountains.

![Drone image of an apple orchard](assets/img/research/jumla-orchard.jpg)

## What's next

We will share a summary dataset on our [Data & Tools](#data) page.
If you work on agriculture in Karnali Province, [get in touch](#contact).
```

Don't add the title or date to this file. They come from `posts.json` and appear automatically in the banner at the top of the post.

#### Step 3. Add the listing entry

Open `data/posts.json`. Put your cursor just after the first `[`, press Enter, and paste:

```json
  {
    "slug": "field-trip-jumla",
    "title": "Field trip to Jumla: collecting ground truth for crop mapping",
    "date": "2026-11-20",
    "author": "Dr Tej Bahadur Shahi",
    "category": "Research",
    "tags": ["Geospatial AI", "Fieldwork", "Agriculture"],
    "image": "assets/img/research/field-trip-jumla.jpg",
    "excerpt": "Our team collected field data at 120 plots in Jumla to improve satellite-based crop mapping in Nepal's mountains.",
    "featured": false
  },
```

The comma after the closing `}` is needed, because another post follows it.

Commit. After about 2 minutes the post appears on the Blog page, on the Home page under "Latest from HIDI", and at its own address: `.../#post-field-trip-jumla`.

### What each field means

| Field | Required | What to write |
|---|---|---|
| `slug` | Yes | The file name of the post text without `.md`. Lowercase with hyphens. Never change it after publishing, or old links break. |
| `title` | Yes | The headline. |
| `date` | Yes | `YYYY-MM-DD`, such as `2026-11-20`. Newest posts come first. |
| `author` | Yes | The author's name, shown on the post. |
| `category` | Yes | Each new category becomes a filter button on the Blog page. Suggested: `News`, `Research`, `Tutorial`, `Event report`, `Opinion`. |
| `tags` | No | A list such as `["Python", "Training"]`. Use `[]` for none. |
| `image` | Yes | The path to the cover image. |
| `excerpt` | Yes | One or two sentences shown on the post's card. |
| `featured` | No | `true` shows this post large at the top of the Blog page. Only one post should be `true`; if none is, the newest post is featured. |

**Charts and diagrams as cover images:** cards crop images to fit. If your cover is a chart that must not be cropped, add its path to the `FIT` list in `app.js` (see [section 9](#9-add-or-replace-images)).

---

## 4. Edit or delete a blog post

- **Fix a typo in the text:** edit `posts/<slug>.md`.
- **Change the title, summary, image or date:** edit that post's entry in `data/posts.json`.
- **Delete a post:**
  1. In `data/posts.json`, delete the whole entry, from its `{` to its `},`.
  2. Make sure the last remaining entry has **no comma** after its `}` (see [section 12](#12-json-rules)).
  3. Delete `posts/<slug>.md` as well.

---

## 5. Add a publication

Open `data/publications.json` and paste a new entry straight after the first `[`.

### Worked example: a journal article

```json
  {
    "id": "rangeland-xai-2027",
    "title": "Explainable deep learning for mapping rangeland condition from Sentinel-2 time series",
    "authors": "Tej Bahadur Shahi, Sita Gurung, and Ram Sharma",
    "venue": "Remote Sensing of Environment",
    "year": 2027,
    "type": "Journal article",
    "tags": ["Remote sensing", "Explainable AI"],
    "doi": "10.1016/j.rse.2027.123456",
    "url": "",
    "pdf": "",
    "code": "https://github.com/tejshahi/rangeland-xai"
  },
```

### Worked example: a conference paper with a PDF

1. Upload the PDF to the `assets` folder, named after the paper, such as `nepali-slm-2027.pdf`.
2. Add:

```json
  {
    "id": "nepali-slm-2027",
    "title": "Small language models for Nepali and code-mixed social media text",
    "authors": "Tej Bahadur Shahi and co-authors",
    "venue": "IEEE International Conference on Data Mining (ICDM)",
    "year": 2027,
    "type": "Conference paper",
    "tags": ["NLP", "Nepali language"],
    "doi": "",
    "url": "",
    "pdf": "assets/nepali-slm-2027.pdf",
    "code": ""
  },
```

### What each field means

| Field | What to write |
|---|---|
| `id` | A unique short name, such as `rangeland-xai-2027`. Not shown on the site, but projects and research themes use it to link to the paper, so don't change it later. |
| `title` | The full paper title. |
| `authors` | The author list. **Write the founder's name exactly as `Tej Bahadur Shahi`**: the site makes that exact spelling bold. |
| `venue` | The journal or conference name. |
| `year` | A number **without quotes**: `2027`, not `"2027"`. |
| `type` | `Journal article`, `Conference paper`, `Book chapter`, `Preprint`, `Report` or `Policy brief`. Each type becomes a filter automatically. |
| `tags` | Topics, such as `["Remote sensing", "NLP"]`. Each tag becomes a filter button. Reuse the same spelling each time. |
| `doi` | Only the DOI itself. The site adds `https://doi.org/` for you. |
| `url`, `pdf`, `code` | Links, or `""`. An empty field hides that button. |

The Home page statistics (number of publications and number of journals and venues) update automatically from this file.

**Only add a PDF you are allowed to share.** Many publishers allow sharing an accepted manuscript or preprint, but not the final published PDF. Check the journal's policy.

---

## 6. Add an event

Open `data/events.json` and paste after the first `[`.

### Worked example: an online seminar with a date

```json
  {
    "id": "seminar-2027-02-xai",
    "title": "Seminar: Explainable AI for satellite monitoring",
    "type": "Seminar",
    "date": "2027-02-15",
    "time": "4:00 pm NPT",
    "location": "Online (Zoom)",
    "description": "Dr Tej Bahadur Shahi shows how interpretable models reveal what drives satellite-based vegetation maps. Free to attend.",
    "image": "assets/img/research/pasture-clusters-multiyear.jpg",
    "registration": "https://forms.gle/your-google-form-link"
  },
```

### Worked example: date not fixed yet

Use `"date": ""` and `"time": ""`. The event shows a **TBA** date tile and a **Notify me** button, and `"registration": "#contact"` sends people to the contact form.

### What each field means

| Field | What to write |
|---|---|
| `id` | A unique short name. |
| `title` | The event name. |
| `type` | `Seminar`, `Workshop`, `Training` or `Webinar`. |
| `date` | `YYYY-MM-DD`, or `""` for "to be announced". |
| `time` | Free text, such as `4:00 pm NPT`, or `""`. |
| `location` | For example `Online` or `Kathmandu`. |
| `description` | One or two sentences. |
| `image` | Any valid image path (reserved for future use). |
| `registration` | A sign-up link (Google Forms works well) or `#contact`. |

**Events move automatically.** Events dated today or later, and TBA events, appear under **Upcoming events**. Once the date passes, an event moves to **Past events** on its own. After an event, consider an `Event report` blog post.

**Google Forms registration:** create a form at https://forms.google.com, click **Send → link icon**, copy the link and paste it into `registration`.

---

## 7. Add or update a project

Projects live in `data/projects.json`. They appear on the Projects page in two sections, **Current** and **Completed**. The first three current projects also appear on the Home page.

### Worked example

```json
  {
    "id": "jumla-rangeland-pilot",
    "title": "Rangeland monitoring pilot in Jumla",
    "status": "Current",
    "stage": "Seeking partners",
    "period": "2027",
    "theme": "Explainable GeoAI for Earth observation",
    "summary": "Testing interpretable satellite models for rangeland condition with local herders and the district forest office.",
    "partners": "District forest office and a partner university",
    "outputs": ["pasture-obia-clustering-2025"],
    "links": [["Project brief (PDF)", "assets/jumla-brief.pdf"]],
    "image": "assets/img/research/pasture-segments.jpg"
  },
```

| Field | What to write |
|---|---|
| `id` | A unique short name. |
| `status` | `Current` or `Completed`. This decides the section. |
| `stage` | The label on the card: for example `In development`, `Ongoing`, `Seeking partners`, `Planned` or `Completed`. "Planned" and "Seeking…" show an orange label; "Completed…" shows grey; anything else shows blue. |
| `period` | For example `2027`, `2026 onwards` or `2023`. |
| `theme` | One of the four research themes. |
| `summary` | Two or three sentences. Only include results that are already published or public. |
| `partners` | Partner organisations, or a phrase such as `Open to research and industry partners`. **Name a partner only with their agreement.** |
| `outputs` | Publication `id`s from `data/publications.json`. Each is listed on the card with a link. Use `[]` for none. |
| `links` | Other links as `["Label", "URL"]` pairs, or `[]`. |
| `image` | An image path. |

**When a project finishes:** change `status` to `Completed`, update `stage` (for example `Completed`), and add the publications to `outputs`.

---

## 8. Update the Data & Tools page

The datasets, code, tutorials and planned resources on the Data & Tools page are listed in `const TOOLS` in `assets/js/app.js`. Each line has six parts:

```js
  ["Dataset", "NepEMO: Nepali emotion and sentiment dataset", "4,462 manually labelled Nepali Reddit posts…", "https://github.com/tejshahi/Nepali-Reddit-NepEMO-", "Open on GitHub", "Released"],
```

| Position | Meaning | Example |
|---|---|---|
| 1 | Kind | `Dataset`, `Code`, `Tutorial`, `Toolkit`, `Guide` |
| 2 | Title | `NepEMO: Nepali emotion and sentiment dataset` |
| 3 | Description | One or two sentences |
| 4 | Link | A GitHub link, a page such as `#projects`, or a post such as `#post-python-for-research-first-steps` |
| 5 | Link label | `Open on GitHub`, `Read the tutorial`, `See the project` |
| 6 | Status | `Released`, `In development` or `Planned` |

**To release a planned tool:** change its status to `Released` and replace the link with the real one. The "Open datasets, code and tutorials" number on the Home page counts the `Released` entries automatically.

The figure gallery lower on the same page comes from `const CREDITS` (see the next section).

---

## 9. Add or replace images

### Image guidelines

| Use | Shape | Suggested size |
|---|---|---|
| Blog covers and page banners | Landscape, 16:10 | 1200 × 750 px |
| Research theme and project images | Landscape, 4:3 | 1200 × 900 px |
| Portraits | Square | 600 × 600 px |

- **Formats:** `.jpg` for photos and maps, `.png` for charts.
- **Size:** keep each image under about 500 KB. Compress at https://squoosh.app.
- **File names:** lowercase with hyphens and no spaces, such as `jumla-orchard.jpg`.
- **Permission:** see [section 15](#15-what-not-to-publish).

### Where the site's images are set

All page images are named once, in `const IMG` near the top of `assets/js/app.js`:

```js
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
```

| Name | Source | Main places it appears |
|---|---|---|
| `hero` | Shahi et al. (2025), *Remote Sensing*, Fig. 8a | Home main image, About, Get involved, Contact |
| `site1` | Shahi et al. (2025), *Remote Sensing*, Fig. 8 | Welcome post, a project card |
| `geo` | Shahi et al. (2025), *Remote Sensing*, Fig. 10 | GeoAI research theme, Projects, Services and Support banners |
| `segments` | Shahi et al. (2025), *Remote Sensing*, Fig. 4 | Research, About and Organisations banners; multi-modal theme |
| `uav` | Shahi et al. (2023), *Drones*, Fig. 1a | Drones theme, Blog banner, Home |
| `weeds` | Shahi et al. (2023), *Drones*, Fig. 8 | Events banner, a project card |
| `leaves` | Bhandari et al. (2023), *Journal of Imaging*, Fig. 1 | Publications and Institutions banners |
| `nlp` | Chart from the NepEMO dataset | NLP theme, Data & Tools banner |
| `trends` | Chart from the NepEMO dataset | Training and Researchers banners, Python tutorial |

**To swap an image everywhere it is used**, change its path in `IMG`. For example, to use a new field photo as the Home image, upload `assets/img/research/jumla-field.jpg` and change the `hero` line to:

```js
  hero:     "assets/img/research/jumla-field.jpg",
```

**To add a new image name**, add a line such as `jumla: "assets/img/research/jumla-field.jpg",` inside `IMG`, then use `IMG.jumla` where you want it.

### Credits

Every figure taken from a paper needs a credit. Credits are listed in `const CREDITS`, just below `IMG`, and shown in the gallery on the Data & Tools page. Each line is:

```js
  [IMG.hero, "Caption describing the image.", "Authors (year), Journal volume(issue), article, Figure n", "10.xxxx/doi", "CC BY"],
```

Add a line whenever you add an image from a paper or from someone else.

### Charts that must not be cropped

Page cards crop images to fit. For charts and diagrams, add the image name to `const FIT`:

```js
const FIT = new Set([IMG.nlp, IMG.trends, IMG.leaves, IMG.geo, IMG.segments, IMG.site1]);
```

### Older image files

The older `.svg` files directly in `assets/img/` (such as `hero.svg` and `prog-nlp.svg`) also contain real figures from the same papers, with the source in each file's title. The pages use the files in `assets/img/research/`, so you can leave the `.svg` files as they are.

### Change the founder portrait

Replace `assets/img/founder.png` with a new square photo of the same name. It is used on the About page and under every blog post.

### Put an image inside a blog post

```markdown
![Short description of the image](assets/img/research/jumla-orchard.jpg)
```

---

## 10. Change page text, research themes, services and prices

The text of the fixed pages lives in `assets/js/app.js`. It looks like code, but you only need to change words **inside quotation marks** or **between HTML tags**.

### The safe way to edit app.js

1. Open `assets/js/app.js` and click the pencil icon (or open it in VS Code).
2. Press **Ctrl+F** and search for the words you want to change.
3. Change only the text between quotation marks (`"…"`) or between HTML tags (`<p>…</p>`).
4. Don't delete quotation marks, commas, brackets or backticks (`` ` ``).
5. If your new text needs a double quotation mark `"`, use a single one `'` or curly quotes `“ ”` instead.
6. Preview before pushing (see [section 14](#14-check-your-changes-and-fix-mistakes)). One missing quote can blank the whole site.

### Where to find each part

Search for these names with **Ctrl+F**:

| Search for | What it controls |
|---|---|
| `const CONFIG` | Email address, contact-form key and exchange rate |
| `const IMG`, `const CREDITS`, `const FIT` | Images, credits and uncropped images |
| `const PROGRAMMES` | The four research themes: title, summary, why it matters, research agenda, SDGs and linked publications |
| `const PILLARS` | The four "From data to decisions" boxes on the Home and About pages |
| `const RESULTS` | The "Selected results" cards |
| `const TOOLS` | Data & Tools page entries |
| `const OBJECTIVES` | The objectives list on the About page |
| `const RESEARCHER_SVC` | Services and prices on the "For researchers" page |
| `const INST_SVC`, `const INST_FEES` | Institutional services and fee table |
| `const ORG_FEES` | NGO/INGO indicative fees |
| `const COURSES` | Training courses and prices |
| `const PACKS` | The six launch packages on the Services page |
| `const SERVICE_OPTIONS` | The "Enquiry about" options in the contact form |
| `views.home` | Home page headline, introduction, highlight cards and statistics |
| `views.about` | About page: vision, mission, objectives, impact, values and biography |
| `Dr Shahi is a computer scientist` | The start of Dr Shahi's biography |
| `views.involved` | Get involved page: roles and careers |
| `views.support` | Support page |
| `views.events` | Community programmes on the Events page |

### Example: edit a research theme

Search for `const PROGRAMMES`. Each theme looks like this (shortened):

```js
  { key: "uav", title: "Drones and AI for agriculture", img: IMG.uav,
    short: "Drone imaging and machine learning to improve crop quality and quantity…",
    why: "This programme grows out of the founder's doctoral research…",
    agenda: [
      "Disease, weed and water-stress detection from RGB and multispectral drone imagery with deep learning",
      "…"
    ],
    sdgs: ["SDG 2 Zero hunger", "SDG 12 Responsible production", "SDG 13 Climate action"],
    builds: ["crop-disease-uav-review-2023", "peanut-lls-2023"] },
```

- `title`, `short` and `why` are text you can rewrite.
- `agenda` is the bullet list. Each bullet is in quotes, with commas between bullets but not after the last.
- `sdgs` are the SDG labels shown as chips.
- `builds` lists publication `id`s from `publications.json`, shown under "Builds on our publications".

The first theme in the list is shown as the **Flagship**.

### Example: add a "Selected result"

Search for `const RESULTS` and add a line in the same pattern:

```js
  ["92%", "accuracy for mapping crop types in the Terai with an explainable transformer model", "Remote Sensing, 2027", "terai-crops-2027"],
```

The parts are: the headline number, the sentence after it, the journal and year, and the publication `id`. The Home page shows the first three results.

### Example: change a price

Prices are written in NPR. The international US$ price is calculated automatically.

| You write | Site shows |
|---|---|
| `"3000"` | NPR 3,000 (US$45) |
| `"5000-8000"` | NPR 5,000–8,000 (US$70–115) |
| `"8000+"` | From NPR 8,000 (US$115) |
| `"2000-3500", " /session"` | NPR 2,000–3,500 /session (US$30–50 /session) |

Search for `Research Starter`:

```js
  ["Research", "Research Starter", "3000", "Topic, objectives and research design consultation.", ""],
```

Change `"3000"` to `"3500"` to raise the price to NPR 3,500.

### Example: add a training course

Search for `const COURSES`. Add a comma at the end of the last course line, then a new line:

```js
  ["Explainable AI for Remote Sensing", "4 weeks · Intermediate", ["Satellite time series in Python", "SHAP and feature attribution", "Mini-project on your own area"], "8000-12000"]
```

The parts are: **name**, **length and level**, **bullet points** and **price**.

### Example: update the biography

Search for `Dr Shahi is a computer scientist`. Edit the words between `<p>` and `</p>`. To add a paragraph, copy a whole `<p>…</p>` line and change its text. The "Research areas", "Published in" and "Teaching" rows are just below, between `<dd>` and `</dd>`.

### Example: add a person to the team

When the first Research Fellow, Associate or Intern joins, search for `Our team is growing.` on the About page and replace that line with a short list, for example:

```html
<div class="callout" style="margin-top:40px"><b>Research Associates.</b> Sita Gurung (remote sensing) · Ram Sharma (NLP)</div>
```

Add only people who have agreed to be listed.

---

## 11. Menu, footer and website settings

### Menu and footer

The top menu, logo and footer are in `index.html`. The current menu is:

```html
<a href="#research">Research</a>
<a href="#publications">Publications</a>
<a href="#blog">Blog</a>
<a href="#events">Events</a>
<a href="#training">Training</a>
<a href="#services">Services</a>
<a href="#about">About</a>
<a href="#contact" class="nav-cta">Get in touch</a>
```

- **Rename an item:** change the word between `>` and `</a>`.
- **Add an item,** for example Projects: copy a line and change it to `<a href="#projects">Projects</a>`. Keep the menu short. With more than eight items, it may wrap on laptop screens.
- **Footer links** are in the `<footer>` section of the same file, grouped under "Research themes", "Quick links" and "Contact".

### Website settings

At the top of `assets/js/app.js`:

```js
const CONFIG = {
  email: "info@hidi.org",
  web3formsKey: "",
  nprPerUsd: 140,
  intlFactor: 2
};
```

| Setting | What it does |
|---|---|
| `email` | The address shown on the Contact page. It also appears in the footer of `index.html`; change it there too. |
| `web3formsKey` | Turns on the contact form so enquiries arrive by email (below). |
| `nprPerUsd` | The exchange rate used for US$ prices. |
| `intlFactor` | Multiplier for international prices. `2` means double the converted NPR price; `1` is a straight conversion. |

### Turn on the contact form (free)

1. Go to https://web3forms.com.
2. Enter the email address that should receive enquiries and click **Create Access Key**.
3. Copy the key from the email they send you and paste it between the quotation marks: `web3formsKey: "a1b2c3d4-…",`
4. Commit, wait two minutes, then send a test enquiry from the Contact page.

Without a key, visitors who press **Send enquiry** see a ready-to-copy email to send you themselves.

### Connect the hidi.org domain

When the domain is registered in your name:

1. Create a file named `CNAME` (all capitals, no extension) in the top folder of the repository, containing only `hidi.org`.
2. At your domain provider, add the DNS records that GitHub Pages lists in its documentation (four `A` records for the bare domain and a `CNAME` record for `www` pointing to `tejshahi.github.io`).
3. In the repository, go to **Settings → Pages**, enter `hidi.org` as the custom domain, and tick **Enforce HTTPS** once it becomes available.

**Don't add the CNAME file before the domain is set up.** It redirects visitors to hidi.org, so the github.io address would stop working.

---

## 12. JSON rules

`posts.json`, `publications.json`, `events.json` and `projects.json` use a strict format called JSON. **One wrong comma can make a whole page show nothing.**

1. **Text goes in double quotes:** `"title": "My post"`. Single quotes don't work.
2. **Numbers have no quotes:** `"year": 2027`.
3. **true and false have no quotes:** `"featured": true`.
4. **Lists use square brackets:** `"tags": ["Python", "Training"]`. An empty list is `[]`.
5. **A comma goes between entries, but not after the last one.**

✅ Correct:

```json
[
  { "id": "a", "title": "First" },
  { "id": "b", "title": "Second" }
]
```

❌ Wrong: an extra comma after the last entry:

```json
[
  { "id": "a", "title": "First" },
  { "id": "b", "title": "Second" },
]
```

❌ Wrong: a missing comma between entries:

```json
[
  { "id": "a", "title": "First" }
  { "id": "b", "title": "Second" }
]
```

6. **Quotation marks inside text** must be written as `\"`, or replaced with single or curly quotes: `"title": "What does ‘open science’ mean?"`
7. **Use plain straight quotes `"`** for the JSON itself. Text copied from Word may contain curly quotes `“ ”`, which break JSON.

**Check before committing:** paste the whole file into https://jsonlint.com and click **Validate JSON**. It shows the exact line of any mistake.

---

## 13. Markdown cheat sheet

Blog post text (`posts/*.md`) uses Markdown.

| You type | You get |
|---|---|
| `## Section heading` | A large heading |
| `### Smaller heading` | A smaller heading |
| `**bold text**` | **bold text** |
| `*italic text*` | *italic text* |
| `[link text](https://example.com)` | A link to another website |
| `[contact us](#contact)` | A link to a page on this site |
| `- item` | A bullet point |
| `1. item` | A numbered list |
| `> quoted text` | A quote with a coloured bar |
| `![description](assets/img/research/photo.jpg)` | An image |
| `` `code` `` | Inline code |
| `---` | A horizontal line |
| A blank line | Starts a new paragraph |
| `\| A \| B \|` rows | A table (see the Python tutorial post for an example) |

Code blocks go between three backticks:

````markdown
```python
import pandas as pd
df = pd.read_csv("data.csv")
```
````

**Links to pages on this site:**

| Page | Link |
|---|---|
| Home | `#home` |
| Research | `#research` |
| Projects | `#projects` |
| Publications | `#publications` |
| Data & Tools | `#data` |
| Blog | `#blog` |
| A specific post | `#post-<slug>`, such as `#post-field-trip-jumla` |
| Events | `#events` |
| Training | `#training` |
| Services | `#services` |
| For researchers / institutions / organisations | `#researchers`, `#institutions`, `#organisations` |
| About | `#about` |
| Get involved | `#involved` |
| Support | `#support` |
| Contact | `#contact` |

---

## 14. Check your changes and fix mistakes

### Preview on your computer before publishing

Double-click **`preview.bat`** in the website folder. It starts a small local web server and opens the site at http://localhost:8000. Leave the black window open while you check; close it to stop.

If it says Python was not found, install Python free from https://www.python.org/downloads/ and tick **Add python.exe to PATH** during installation.

(Opening `index.html` directly by double-clicking won't load posts and data, because browsers block that.)

### After publishing

1. Wait 1–2 minutes. In the repository's **Actions** tab, a green tick ✅ means the update is live.
2. Open the site and press **Ctrl+F5** to load the newest version instead of the cached one.
3. Check the page you changed, on your phone as well if you can.

### Common problems

| Problem | Likely cause | Fix |
|---|---|---|
| Blog, Publications, Events or Projects page is empty | A JSON mistake, usually a comma | Paste the file into jsonlint.com, fix the line it shows, and commit |
| A post says "The full post could not be loaded" | The `.md` file name doesn't match the `slug` | Make them identical: slug `field-trip-jumla` needs `posts/field-trip-jumla.md` |
| A post shows "Page not found" | The slug in the link doesn't match `posts.json` | Check the spelling of the slug |
| An image doesn't appear | Wrong path or file name | File names are case-sensitive: `Photo.JPG` and `photo.jpg` are different. Use lowercase. |
| A chart looks cut off on a card | The image is cropped to fit | Add it to `const FIT` (section 9) |
| A project's publication link is missing | The `outputs` id doesn't match `publications.json` | Copy the exact `id` |
| The change doesn't show | Browser cache, or not deployed yet | Wait 2 minutes and press Ctrl+F5 |
| The whole site is blank | A mistake in `app.js` | Undo the last change (below) |
| `git push` is refused | Changes were made on github.com since your last pull | Run `git pull`, then `git push` |

### Undo a change

**On github.com:**
1. Open the file you broke and click **History** (top right).
2. Click the last version that worked, then the **⋯** menu → **View file**.
3. Click **Raw**, select all and copy.
4. Go back to the current file, click the pencil icon, replace everything with what you copied, and commit.

**With Command Prompt** (undo your most recent commit):

```cmd
git revert --no-edit HEAD
git push
```

---

## 15. What not to publish

- **Images:** use only your own photos, figures from your own **open-access** papers whose licence allows reuse (such as CC BY, with a credit in `CREDITS`), or images you have written permission to use. Don't copy figures from subscription journals, even your own, unless the publisher allows it.
- **Projects under contract or copyright:** don't name or describe projects whose results, name or data are restricted by a funder, employer or partner agreement. Published papers from such work can still be listed on the Publications page.
- **People and partners:** list team members, partners and funders only with their agreement.
- **PDFs:** share only versions the publisher allows (usually the accepted manuscript or preprint).
- **Personal data:** never publish contact details, survey responses or field data that could identify people.

---

## 16. Quick checklists

### New blog post
- [ ] Choose a slug: lowercase with hyphens
- [ ] Upload the cover image to `assets/img/research/` (landscape, under 500 KB)
- [ ] Create `posts/<slug>.md`
- [ ] Add an entry to `data/posts.json` with a matching `slug` and `image` path
- [ ] Validate `posts.json` at jsonlint.com
- [ ] Preview, commit, wait 2 minutes, press Ctrl+F5

### New publication
- [ ] Add an entry to `data/publications.json`
- [ ] Founder's name written as `Tej Bahadur Shahi`
- [ ] `year` is a number without quotes; unused links are `""`
- [ ] Tags reuse earlier spellings
- [ ] Validate and commit
- [ ] If it supports a project or research theme, add its `id` to that project's `outputs` or the theme's `builds`

### New event
- [ ] Add an entry to `data/events.json`
- [ ] Date as `YYYY-MM-DD`, or `""` for TBA
- [ ] Registration link works
- [ ] Validate and commit
- [ ] After the event, write an `Event report` post

### New or updated project
- [ ] Add or edit the entry in `data/projects.json`
- [ ] `status` is `Current` or `Completed`; `stage` describes it honestly
- [ ] Partners named only with agreement; nothing restricted by contract
- [ ] `outputs` ids match `publications.json`
- [ ] Validate and commit

### Text, price or image change
- [ ] Search `assets/js/app.js` (or `index.html` for the menu and footer) with Ctrl+F
- [ ] Change only text inside quotes or between HTML tags
- [ ] New images have a credit in `CREDITS` if they come from a paper
- [ ] Preview with `preview.bat`, then commit and check the page
