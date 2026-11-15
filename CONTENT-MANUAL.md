# HIDI Website: Content Manual

HIDI is the **Himalayan Institute for Data Intelligence**. The GitHub repository keeps its original name, `naidslab`.

How to add and change content on the HIDI website, with worked examples you can copy.

- **Website:** https://tejshahi.github.io/naidslab/ (later https://hidi.org)
- **Repository:** https://github.com/tejshahi/naidslab

---

## Contents

1. [How the website works](#1-how-the-website-works)
2. [Two ways to edit](#2-two-ways-to-edit)
3. [Add a blog post](#3-add-a-blog-post)
4. [Edit or delete a blog post](#4-edit-or-delete-a-blog-post)
5. [Add a publication](#5-add-a-publication)
6. [Add an event](#6-add-an-event)
7. [Add or replace images](#7-add-or-replace-images)
8. [Change page text, services and prices](#8-change-page-text-services-and-prices)
9. [Website settings](#9-website-settings)
10. [JSON rules (read this before editing data files)](#10-json-rules)
11. [Markdown cheat sheet for blog posts](#11-markdown-cheat-sheet)
12. [Check your changes and fix mistakes](#12-check-your-changes-and-fix-mistakes)
13. [Quick checklists](#13-quick-checklists)

---

## 1. How the website works

The site is a set of plain files. GitHub Pages publishes whatever is in the repository, usually within 1–2 minutes of a change.

```
naidslab/
├── index.html                 Page shell: header menu, footer
├── CNAME                      Custom domain (only once hidi.org is bought)
├── README.md                  Short technical notes
├── CONTENT-MANUAL.md          This manual
├── assets/
│   ├── css/style.css          Colours, fonts and layout (rarely edited)
│   ├── js/app.js              Page text, services, prices, settings
│   └── img/                   All images
├── data/
│   ├── posts.json             List of blog posts
│   ├── publications.json      List of publications
│   └── events.json            List of events
└── posts/
    └── <slug>.md              The text of each blog post
```

**Most of the time you only touch these:**

| You want to… | Files to edit |
|---|---|
| Publish a blog post | Upload an image → create `posts/<slug>.md` → add an entry to `data/posts.json` |
| Add a publication | `data/publications.json` |
| Add an event | `data/events.json` |
| Change text, prices, courses or the bio | `assets/js/app.js` |
| Change the email address or turn on the contact form | Settings at the top of `assets/js/app.js` |

Blog posts, publications and events are sorted automatically: posts by date (newest first), publications by year and events by date. So it doesn't matter where in the file you add a new entry. Adding it at the top is simply easiest.

---

## 2. Two ways to edit

### Option A: in the browser on github.com (recommended)

You don't need to install anything.

**To edit an existing file:**
1. Go to https://github.com/tejshahi/naidslab and sign in as **tejshahi**.
2. Click through to the file, for example `data` → `events.json`.
3. Click the **pencil icon** (✏️ "Edit this file") at the top right of the file.
4. Make your change.
5. Click the green **Commit changes…** button.
6. In the box that opens, write a short message such as `Add seminar event`, then click **Commit changes**.

**To create a new file:**
1. Open the folder, for example `posts`.
2. Click **Add file → Create new file**.
3. Type the file name, for example `field-trip-jumla.md`, then write the content and commit.

**To upload images or other files:**
1. Open the folder, for example `assets/img`.
2. Click **Add file → Upload files**, drag the files in, and commit.

### Option B: on your computer with Command Prompt

Use this if you set the site up with `git`, or if you'd rather edit in VS Code or Notepad.

**Every time, before you start**, open Command Prompt and fetch the latest version, including any edits made on github.com:

```cmd
cd C:\Users\YourName\naidslab
git pull
```

Edit the files on your computer. When you've finished, send the changes to GitHub:

```cmd
git add .
git commit -m "Add field trip blog post"
git push
```

> **Tip:** Always run `git pull` first. If you skip it after editing on github.com, the push will be refused. If that happens, run `git pull`, then `git push` again.

---

## 3. Add a blog post

A blog post has three parts:

| Part | Where it goes | Example |
|---|---|---|
| Cover image | `assets/img/` | `assets/img/field-trip-jumla.jpg` |
| Post text | `posts/` | `posts/field-trip-jumla.md` |
| Listing entry | `data/posts.json` | title, date, category, summary |

The three are linked by the **slug**: a short, lowercase name with hyphens and no spaces, such as `field-trip-jumla`. The text file must be named `<slug>.md`.

### Worked example: "Field trip to Jumla"

#### Step 1. Upload the cover image

1. Prepare a landscape photo about **1200 × 750 pixels**. A phone photo is fine, but keep it under about 500 KB. You can shrink it at https://squoosh.app if needed.
2. Name it after the slug: `field-trip-jumla.jpg`. Use lowercase with no spaces.
3. On GitHub, open `assets/img` → **Add file → Upload files**, upload it, and commit.

#### Step 2. Write the post text

Open `posts` → **Add file → Create new file**. Name it `field-trip-jumla.md` and paste in your text, for example:

```markdown
In November, the HIDI team visited **Jumla** to collect ground-truth data
for our Geospatial AI programme. Field samples like these let us check what
satellite images are telling us about crops and pastures.

## What we did

- Recorded crop types at 120 GPS-tagged field plots
- Took drone images over three apple orchards
- Met farmers and the local agriculture office to discuss their data needs

## Why it matters

Satellite models trained on plains data often fail in mountain districts.
Local field data helps us build models that work in Nepal's hills and mountains.

![Drone image of an apple orchard](assets/img/jumla-orchard.jpg)

> "The field visit showed us how much local knowledge we still need to capture."

## What's next

We will share a summary dataset on our [Publications](#publications) page.
If you work on agriculture in Karnali Province, [get in touch](#contact).
```

Don't add the title or date to this file. They come from `posts.json` and appear automatically in the banner at the top of the post.

Commit the file.

#### Step 3. Add the listing entry

Open `data/posts.json` and click the pencil icon. The file starts like this:

```json
[
  {
    "slug": "welcome-to-hidi",
    ...
```

Put your cursor just after the first `[`, press Enter, and paste:

```json
  {
    "slug": "field-trip-jumla",
    "title": "Field trip to Jumla: collecting ground truth for crop mapping",
    "date": "2026-11-20",
    "author": "Dr Tej Bahadur Shahi",
    "category": "Research",
    "tags": ["Geospatial AI", "Fieldwork", "Agriculture"],
    "image": "assets/img/field-trip-jumla.jpg",
    "excerpt": "Our team collected field data at 120 plots in Jumla to improve satellite-based crop mapping in Nepal's mountains.",
    "featured": false
  },
```

The comma after the closing `}` is needed, because another post follows it.

Commit. After about 2 minutes, the post appears on the News & Events page, on the Home page under "Latest from HIDI", and at its own address: `.../#post-field-trip-jumla`.

### What each field means

| Field | Required | What to write |
|---|---|---|
| `slug` | Yes | The file name of the post text without `.md`. Lowercase with hyphens. Never change it after publishing, or old links break. |
| `title` | Yes | The headline. |
| `date` | Yes | `YYYY-MM-DD`, such as `2026-11-20`. It sets the order: newest first. |
| `author` | Yes | The author's name, shown on the post. |
| `category` | Yes | One word or short phrase. Each new category becomes a filter button on the Blog page automatically. Suggested categories: `News`, `Research`, `Tutorial`, `Event report`, `Opinion`. |
| `tags` | No | A list in square brackets, such as `["Python", "Training"]`. Search on the Blog page finds these. Use `[]` for none. |
| `image` | Yes | The path to the cover image, such as `assets/img/field-trip-jumla.jpg`. |
| `excerpt` | Yes | One or two sentences shown on the post's card. |
| `featured` | No | `true` shows this post large at the top of the Blog page. Only one post should be `true`. If none is, the newest post is featured. |

### Feature a post

Set `"featured": true` on the new post, and change the old featured post to `"featured": false`.

---

## 4. Edit or delete a blog post

**Fix a typo in the text:** edit `posts/<slug>.md`.

**Change the title, summary, image or date:** edit that post's entry in `data/posts.json`.

**Delete a post:**
1. In `data/posts.json`, delete the whole entry, from its `{` to its `},`.
2. Make sure the last remaining entry has **no comma** after its `}` (see [section 10](#10-json-rules)).
3. Optionally, delete `posts/<slug>.md`: open the file, click the **⋯** menu, then **Delete file**.

---

## 5. Add a publication

### Worked example: a journal article

Open `data/publications.json`, click the pencil icon, and paste this straight after the first `[`:

```json
  {
    "id": "pasture-mapping-2026",
    "title": "Mapping pasture types in mountain rangelands using Sentinel-2 time series and deep learning",
    "authors": "T. B. Shahi, A. Neupane, and R. Sharma",
    "venue": "Remote Sensing of Environment",
    "year": 2026,
    "type": "Journal article",
    "tags": ["Remote sensing", "Geospatial AI", "Agriculture"],
    "doi": "10.1016/j.rse.2026.123456",
    "url": "",
    "pdf": "",
    "code": "https://github.com/tejshahi/pasture-clustering"
  },
```

### Worked example: a conference paper with a PDF

1. Name the PDF after the publication, such as `nepali-sentiment-2027.pdf`, and upload it to the `assets` folder (**Add file → Upload files**).
2. Add this entry:

```json
  {
    "id": "nepali-sentiment-2027",
    "title": "Sentiment analysis of Nepali social media text with small language models",
    "authors": "T. B. Shahi and co-authors",
    "venue": "Proceedings of the International Conference on Asian Language Processing",
    "year": 2027,
    "type": "Conference paper",
    "tags": ["NLP", "Nepali language"],
    "doi": "",
    "url": "",
    "pdf": "assets/nepali-sentiment-2027.pdf",
    "code": ""
  },
```

### What each field means

| Field | What to write |
|---|---|
| `id` | Any unique short name, such as `pasture-mapping-2026`. It isn't shown on the site. |
| `title` | The full paper title. |
| `authors` | Authors as you want them shown, such as `T. B. Shahi, A. Neupane, and R. Sharma`. |
| `venue` | The journal or conference name, shown in italics. |
| `year` | A number **without quotes**: `2026`, not `"2026"`. |
| `type` | For example `Journal article`, `Conference paper`, `Preprint`, `Book chapter`, `Report` or `Thesis`. Each type becomes a filter automatically. |
| `tags` | Topics, such as `["Remote sensing", "NLP"]`. Each tag becomes a topic filter button. Reuse the same spelling each time, so `Remote sensing` and `Remote Sensing` don't become two buttons. |
| `doi` | Only the DOI itself, such as `10.1016/j.rse.2026.123456`. The site adds `https://doi.org/` for you. |
| `url` | Any web link to the paper, or `""`. |
| `pdf` | A link or file path to the PDF, or `""`. |
| `code` | A GitHub or code link, or `""`. |

An empty field (`""`) hides that button.

**Only add a PDF you are allowed to share.** Many publishers allow sharing an accepted manuscript or preprint, but not the final published PDF. Check the journal's policy.

---

## 6. Add an event

### Worked example: an online seminar with a date

Open `data/events.json` and paste after the first `[`:

```json
  {
    "id": "seminar-2027-02-geoai",
    "title": "Seminar: Satellite AI for Nepal's agriculture",
    "type": "Seminar",
    "date": "2027-02-15",
    "time": "4:00 pm NPT",
    "location": "Online (Zoom)",
    "description": "Dr Tej Bahadur Shahi introduces how free satellite data and deep learning can monitor crops in Nepal. Free to attend.",
    "image": "assets/img/event-seminar.svg",
    "registration": "https://forms.gle/your-google-form-link"
  },
```

### Worked example: an event announced before the date is fixed

```json
  {
    "id": "workshop-2027",
    "title": "HIDI Annual Workshop on AI and Data Science 2027",
    "type": "Workshop",
    "date": "",
    "time": "",
    "location": "Kathmandu",
    "description": "Tutorials, keynotes and student paper sessions with partner universities. Date to be announced.",
    "image": "assets/img/event-workshop.svg",
    "registration": "#contact"
  },
```

With `"date": ""`, the event shows a **TBA** date tile and a **Notify me** button.

### What each field means

| Field | What to write |
|---|---|
| `id` | Any unique short name. |
| `title` | The event name. |
| `type` | For example `Seminar`, `Workshop`, `Training` or `Webinar`. |
| `date` | `YYYY-MM-DD`, or `""` for "to be announced". |
| `time` | Free text, such as `4:00 pm NPT`, or `""`. |
| `location` | For example `Online` or `Kist College, Kathmandu`. |
| `description` | One or two sentences. |
| `image` | An image path (reserved for future use; keep any valid image). |
| `registration` | A link to a sign-up form (Google Forms works well), or `#contact` to send people to the contact form. |

### How events move automatically

- Events with a date **today or later**, and events marked TBA, appear under **Upcoming events**, soonest first.
- Once the date has passed, an event moves to **Past events** by itself. You don't need to edit anything.
- After an event, consider writing a blog post with the category `Event report` and photos.

### Simple registration with Google Forms

1. Go to https://forms.google.com and create a form with fields for name, email, organisation and so on.
2. Click **Send → link icon** and copy the link.
3. Paste it into the event's `registration` field.

---

## 6a. Add or update a project

Projects live in `data/projects.json` and appear on the Projects page (current and completed) and, for current projects, on the Home page.

```json
{
  "id": "jumla-rangeland-pilot",
  "title": "Rangeland monitoring pilot in Jumla",
  "status": "Current",
  "stage": "In development",
  "period": "2027",
  "theme": "Explainable GeoAI for Earth observation",
  "summary": "One or two sentences on what the project does and why.",
  "partners": "Partner organisations",
  "outputs": ["pasture-obia-clustering-2025"],
  "links": [["Project report (PDF)", "assets/pdf/jumla-report.pdf"]],
  "image": "assets/img/research/pasture-segments.jpg"
}
```

| Field | What to write |
|---|---|
| `status` | `Current` or `Completed`. This decides which section the project appears in. |
| `stage` | The label on the card, such as `In development`, `Seeking partners`, `Planned` or `Completed`. Words like "Planned" and "Seeking" show an orange label; "Completed" shows grey. |
| `outputs` | Publication `id`s from `data/publications.json`. They are listed on the card with links. |
| `links` | Any other links, as `["Label", "URL"]` pairs. |

When a current project finishes, change `status` to `Completed` and update `stage`.

## 6b. Data & Tools page

The datasets, code and tutorials on the Data & Tools page are listed in `const TOOLS` in `assets/js/app.js`. Each line is `[kind, title, description, link, link label, status]`. The figure gallery on the same page comes from `const CREDITS`.

## 7. Add or replace images

### Image guidelines

| Use | Shape | Suggested size |
|---|---|---|
| Blog cover and page banners | Landscape, 16:10 | 1200 × 750 px |
| Research programme images | Landscape, 4:3 | 1200 × 900 px |
| Founder portraits | Square | 600 × 600 px |

- **Formats:** `.jpg` for photos, `.png` for diagrams, `.svg` for graphics.
- **Size:** keep each image under about 500 KB. Compress at https://squoosh.app.
- **File names:** lowercase with hyphens and no spaces, such as `jumla-orchard.jpg`.
- **Permission:** only use photos you took or have permission to use.

### The site's images and where they appear

All page images are named once, in the `IMG` list near the top of `assets/js/app.js`. Every image is real: figures from the founder's open-access papers (reused under their CC BY licences) and charts made from the open NepEMO dataset. Their credits are in the `CREDITS` list just below `IMG`, and are shown on the Research page.

| Name in `IMG` | File in `assets/img/research/` | Source | Where it appears |
|---|---|---|---|
| `hero` | `pasture-clusters-panel.jpg` | Shahi et al. (2025), *Remote Sensing*, Fig. 8a | Home main image, About mission image, welcome post card |
| `site1` | `pasture-clusters-site1.jpg` | Shahi et al. (2025), *Remote Sensing*, Fig. 8 | Inside the welcome post |
| `geo` | `pasture-clusters-multiyear.jpg` | Shahi et al. (2025), *Remote Sensing*, Fig. 10 | GeoAI programme; Services and Support banners |
| `segments` | `pasture-segments.jpg` | Shahi et al. (2025), *Remote Sensing*, Fig. 4 | Research, About and Organisations banners; GeoAI post |
| `uav` | `uav-cotton-field.jpg` | Shahi et al. (2023), *Drones*, Fig. 1a | UAV programme; Blog banner; Home funding section |
| `weeds` | `uav-weed-samples.jpg` | Shahi et al. (2023), *Drones*, Fig. 8 | Events banner |
| `leaves` | `tomato-leaf-diseases.jpg` | Bhandari et al. (2023), *Journal of Imaging*, Fig. 1 | ML programme; Publications and Institutions banners |
| `nlp` | `nepemo-emotions.png` | Chart from the NepEMO dataset | NLP programme |
| `trends` | `nepemo-trends.png` | Chart from the NepEMO dataset | Python tutorial post; Training and Researchers banners |

The old placeholder `.svg` files in `assets/img/` (except `favicon.svg`) are no longer used and can be deleted.

### Replace or add an image

1. Upload the new image to `assets/img/research/`, for example `jumla-field-trip.jpg`.
2. In `assets/js/app.js`, search for `const IMG` and change the path next to the name you want to replace, or add a new line such as `jumla: "assets/img/research/jumla-field-trip.jpg",`.
3. If the image comes from a paper or someone else, add a line to `CREDITS` with a caption, the source and the licence.
4. For charts or diagrams that must not be cropped, add the image name to the `FIT` list.

### Put an image inside a blog post

Upload the image to `assets/img`, then add this line where you want it in the `.md` file:

```markdown
![Short description of the image](assets/img/jumla-orchard.jpg)
```

---

## 8. Change page text, services and prices

The text of the fixed pages lives in `assets/js/app.js`. It looks like code, but you only need to change words **inside quotation marks**.

### The safe way to edit app.js

1. Open `assets/js/app.js` and click the pencil icon.
2. Press **Ctrl+F** and search for the words you want to change.
3. Change only the text between the quotation marks (`"…"`) or between HTML tags (`<p>…</p>`).
4. Don't delete quotation marks, commas, brackets or backticks (`` ` ``).
5. If your new text contains a double quotation mark `"`, use a single one `'` or curly quotes `“ ”` instead.

### How prices are written

Prices are written in NPR. The international price in US$ brackets is calculated automatically.

| You write | Site shows |
|---|---|
| `"3000"` | NPR 3,000 (US$45) |
| `"5000-8000"` | NPR 5,000–8,000 (US$70–115) |
| `"8000+"` | From NPR 8,000 (US$115) |
| `"2000-3500", " /session"` | NPR 2,000–3,500 /session (US$30–50 /session) |

### Example: change a price

Search for `Research Starter`. You'll find:

```js
  ["Research", "Research Starter", "3000", "Topic, objectives and research design consultation.", ""],
```

To raise it to NPR 3,500, change `"3000"` to `"3500"`:

```js
  ["Research", "Research Starter", "3500", "Topic, objectives and research design consultation.", ""],
```

### Example: change a service description

Search for `Data analysis support`:

```js
  ["Data analysis support", "Analysis of a defined dataset, priced by complexity.", ["Cleaning and preparation", "Statistical or ML analysis", "Tables and interpretation notes"], "5000-20000"],
```

The parts are, in order: **name**, **one-line description**, **bullet points** (in square brackets) and **price**. Change any of the quoted text, for example:

```js
  ["Data analysis support", "Analysis of a defined dataset in R, Python or SPSS.", ["Cleaning and preparation", "Statistical or ML analysis", "Tables, figures and interpretation notes"], "5000-20000"],
```

### Example: add a new training course

Search for `const COURSES`. Each course is one line:

```js
  ["Research Proposal and Grant Development", "3–4 weeks · Researchers and academics", ["Proposal development", "Methodology and budgeting", "Funding opportunities"], "5000-7000"]
```

Add a comma at the end of the last course line, then add a new line:

```js
  ["Research Proposal and Grant Development", "3–4 weeks · Researchers and academics", ["Proposal development", "Methodology and budgeting", "Funding opportunities"], "5000-7000"],
  ["Deep Learning for Computer Vision", "6 weeks · Advanced", ["CNNs and vision transformers", "Training on your own images", "Deploying a small model"], "8000-12000"]
```

### Where to find each part of the site in app.js

Search for these names with **Ctrl+F**:

| Search for | What it controls |
|---|---|
| `const CONFIG` | Email address, contact form key and exchange rate (see [section 9](#9-website-settings)) |
| `const IMG` | All page images in one place |
| `const PROGRAMMES` | The four research programmes: title, summary, why it matters, research agenda, SDGs and the publications each builds on |
| `const TOOLS` | Data & Tools page entries |
| `const OBJECTIVES` | The objectives list on the About page |
| `const PILLARS` | The four "From data to decisions" boxes (Data, Algorithms, Insight, Applications) on the Home and About pages |
| `const RESULTS` | The "Selected results" cards |
| `const CREDITS` | Image captions and credits |
| `const RESEARCHER_SVC` | Services and prices on the "For researchers" page |
| `const INST_SVC` | Service cards on the "For institutions" page |
| `const INST_FEES` | The institutional fees table |
| `const ORG_FEES` | The NGO/INGO indicative fees table |
| `const COURSES` | Training courses and prices |
| `const PACKS` | The six launch packages on the Services page |
| `const SERVICE_OPTIONS` | The "Enquiry about" options in the contact form |
| `views.home` | Home page headline, introduction and statistics |
| `views.about` | About page: vision, approach, impact, values, the founder's biography and terms |
| `Dr Shahi is a computer scientist` | The start of Dr Shahi's biography |
| `views.support` | Support us page |
| `views.events` | The community programmes section on the Events page |

### Example: update Dr Shahi's biography

Search for `Dr Shahi is a computer scientist`. You'll find a paragraph like:

```html
<p>Dr Shahi is a computer scientist working where machine learning, image processing and remote sensing meet. He completed a postdoctoral fellowship at QUT ...</p>
```

Edit the words between `<p>` and `</p>`. To add another paragraph, copy a whole `<p>…</p>` line and change its text.

### Example: change a home page statistic

Search for `founder's publications`:

```html
<div><b>16+</b><span>founder's publications</span></div>
```

Change `16+` to the new number, such as `20+`.

### Menu and footer

The top menu and the footer are in `index.html`. For example, to rename a menu item, search for `<a href="#training">Training</a>` and change the word between `>` and `</a>`.

---

## 9. Website settings

At the top of `assets/js/app.js`:

```js
const CONFIG = {
  email: "info@hidi.org",
  web3formsKey: "",
  nprPerUsd: 140,
  intlFactor: 2
};
```

| Setting | What it does | Example |
|---|---|---|
| `email` | The address shown on the Contact page | `"info@hidi.org"` |
| `web3formsKey` | Turns on the contact form so enquiries arrive by email | `"a1b2c3d4-...."` |
| `nprPerUsd` | The exchange rate used for US$ prices | `140` |
| `intlFactor` | Multiplier for international prices. `2` means international clients pay double the converted NPR price; `1` gives a straight conversion. | `2` |

The email address also appears as text in the footer. Search `index.html` for `info@hidi.org` and change it there too.

### Turn on the contact form (free)

1. Go to https://web3forms.com.
2. Enter the email address that should receive enquiries, such as info@hidi.org, and click **Create Access Key**.
3. Copy the key from the email they send you.
4. Paste it between the quotation marks:

```js
  web3formsKey: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
```

5. Commit, wait two minutes, then send a test enquiry from the Contact page.

Without a key, visitors who press **Send enquiry** see a ready-to-copy email to send you themselves.

### Connect hidi.org later

When you have bought the domain:

1. Create a file named `CNAME` (all capitals, no extension) in the top folder of the repository, containing only:

   ```
   hidi.org
   ```

2. Commit, then set up the DNS records in Cloudflare and tick **Enforce HTTPS** in **Settings → Pages**.

**Don't add the CNAME file before you own the domain.** It redirects visitors to hidi.org, so the site would stop working at the github.io address.

---

## 10. JSON rules

`posts.json`, `publications.json` and `events.json` use a strict format called JSON. **One wrong comma can make a whole page show nothing.** Follow these rules:

1. **Text goes in double quotes:** `"title": "My post"`. Single quotes (`'`) don't work.
2. **Numbers have no quotes:** `"year": 2026`.
3. **true and false have no quotes:** `"featured": true`.
4. **Lists use square brackets:** `"tags": ["Python", "Training"]`. An empty list is `[]`.
5. **A comma goes between entries, but not after the last one.**

✅ **Correct**: a comma between entries, none after the last:

```json
[
  { "id": "a", "title": "First" },
  { "id": "b", "title": "Second" }
]
```

❌ **Wrong**: an extra comma after the last entry:

```json
[
  { "id": "a", "title": "First" },
  { "id": "b", "title": "Second" },
]
```

❌ **Wrong**: a missing comma between entries:

```json
[
  { "id": "a", "title": "First" }
  { "id": "b", "title": "Second" }
]
```

6. **Quotation marks inside text** must be written as `\"`, or replaced with single or curly quotes:

```json
"title": "What does \"open science\" mean?"
"title": "What does ‘open science’ mean?"
```

7. **Use plain straight quotes `"`** for the JSON itself. If you copy text from Word, it may change them to curly quotes `“ ”`, which break JSON. Type JSON in the GitHub editor, Notepad or VS Code.

**Check before committing:** paste the whole file into https://jsonlint.com and click **Validate JSON**. It shows the exact line of any mistake.

---

## 11. Markdown cheat sheet

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
| `![description](assets/img/photo.jpg)` | An image |
| `` `code` `` | Inline code |
| `---` | A horizontal line |
| A blank line | Starts a new paragraph |

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
| Publications | `#publications` |
| Blog | `#blog` |
| A specific post | `#post-<slug>`, such as `#post-field-trip-jumla` |
| Events | `#events` |
| Training | `#training` |
| Services | `#services` |
| For researchers / institutions / organisations | `#researchers`, `#institutions`, `#organisations` |
| Support us | `#support` |
| About | `#about` |
| Contact | `#contact` |

---

## 12. Check your changes and fix mistakes

### After every change

1. Wait 1–2 minutes. You can watch progress in the repository's **Actions** tab: a green tick ✅ means it's live.
2. Open the site and press **Ctrl+F5** (or **Cmd+Shift+R** on a Mac) to load the newest version instead of the cached one.
3. Check the page you changed, on your phone as well if you can.

### Common problems

| Problem | Likely cause | Fix |
|---|---|---|
| Blog, Publications or Events page is empty after an edit | A JSON mistake, usually a comma | Paste the file into jsonlint.com, fix the line it shows, and commit |
| A post opens but says "The full post could not be loaded" | The `.md` file name doesn't match the `slug` | Make them identical: slug `field-trip-jumla` needs `posts/field-trip-jumla.md` |
| Post shows "Page not found" | The slug in the link doesn't match `posts.json` | Check the spelling of the slug |
| Image doesn't appear | Wrong path or file name | File names are case-sensitive: `Photo.JPG` and `photo.jpg` are different. Rename the file to lowercase. |
| Change doesn't show | Browser cache, or not deployed yet | Wait 2 minutes and press Ctrl+F5 |
| Whole site is blank | A mistake in `app.js` | Undo the last change (below) |
| `git push` is refused | Changes were made on github.com since your last pull | Run `git pull`, then `git push` |

### Undo a change

**On github.com:**
1. Open the file you broke and click **History** (top right).
2. Click the last version that worked, then the **⋯** menu → **View file**.
3. Click **Raw**, select all and copy.
4. Go back to the current file, click the pencil icon, replace everything with what you copied, and commit.

**With Command Prompt** (to undo your most recent commit):

```cmd
git revert --no-edit HEAD
git push
```

### Preview on your computer before publishing

Opening `index.html` directly from your computer won't load the posts and data, because browsers block that. If Python is installed, run this in the site folder:

```cmd
cd C:\Users\YourName\naidslab
python -m http.server 8000
```

Then open http://localhost:8000 in your browser. Press **Ctrl+C** in Command Prompt to stop it.

---

## 13. Quick checklists

### New blog post
- [ ] Choose a slug: lowercase with hyphens, such as `field-trip-jumla`
- [ ] Upload the cover image to `assets/img/` (landscape, under 500 KB)
- [ ] Create `posts/<slug>.md` with the post text
- [ ] Add an entry to `data/posts.json` with a matching `slug` and `image` path
- [ ] Validate `posts.json` at jsonlint.com
- [ ] Commit, wait 2 minutes, press Ctrl+F5 and check the post

### New publication
- [ ] Add an entry to `data/publications.json`
- [ ] `year` is a number without quotes
- [ ] Tags use the same spelling as earlier entries
- [ ] Unused links are `""`
- [ ] Validate at jsonlint.com and commit

### New event
- [ ] Add an entry to `data/events.json`
- [ ] Date as `YYYY-MM-DD`, or `""` for TBA
- [ ] Registration link works
- [ ] Validate at jsonlint.com and commit
- [ ] After the event, write an `Event report` blog post

### Price or text change
- [ ] Search `assets/js/app.js` with Ctrl+F
- [ ] Change only text inside quotes or between HTML tags
- [ ] Commit and check the page

---

*Need help? Send the content (post text, publication details or photos) and the exact files can be prepared for you to upload.*
