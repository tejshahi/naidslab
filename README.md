# HIDI website

Static website for HIDI, hosted free on GitHub Pages at **hidi.org**.

## Folder layout

```
index.html              Page shell (header, footer)
assets/css/style.css    Design and layout
assets/js/app.js        All pages, plus the SETTINGS block at the top
assets/img/research/    Research figures and charts used across the site
data/publications.json  Publications list
data/posts.json         Blog post list
data/events.json        Events list
posts/                  Blog post text, one Markdown file per post
CNAME                   Custom domain for GitHub Pages
```

You can edit every file directly on github.com: open the file, click the pencil icon, make your change, then click **Commit changes**. The live site updates within a minute or two.

## Add a blog post

1. **Upload an image** to `assets/img/`. A landscape image about 1200 × 750 px works best, as .jpg, .png or .svg.
2. **Write the post** as a new file in `posts/`, for example `posts/my-new-post.md`. Use Markdown:
   - `## Heading`
   - `**bold**`
   - `[link text](https://...)`
   - `- list item`
3. **Add an entry** at the top of `data/posts.json`:

```json
{
  "slug": "my-new-post",
  "title": "My new post",
  "date": "2026-12-01",
  "author": "Dr Tej Bahadur Shahi",
  "category": "Research",
  "tags": ["Geospatial AI"],
  "image": "assets/img/my-new-post.jpg",
  "excerpt": "One or two sentences shown on the blog list.",
  "featured": false
}
```

The `slug` must match the Markdown file name (without `.md`). Categories appear automatically as filters, for example News, Research, Tutorial or Event report. Set `"featured": true` on one post to show it large at the top of the blog page.

## Add a publication

Add an entry to `data/publications.json`:

```json
{
  "id": "short-unique-id",
  "title": "Paper title",
  "authors": "A. Author, T. B. Shahi, ...",
  "venue": "Journal or conference name",
  "year": 2027,
  "type": "Journal article",
  "tags": ["Remote sensing"],
  "doi": "10.xxxx/xxxxx",
  "url": "",
  "pdf": "",
  "code": "https://github.com/..."
}
```

- **`type`** can be anything, such as Journal article, Conference paper, Preprint, Book chapter or Report. Types, years and tags become filters automatically.
- **Links** are optional. Leave `doi`, `url`, `pdf` or `code` empty (`""`) to hide that button.

## Add an event

Add an entry to `data/events.json`:

```json
{
  "id": "unique-id",
  "title": "Event title",
  "type": "Seminar",
  "date": "2027-02-15",
  "time": "4:00 pm NPT",
  "location": "Online",
  "description": "Short description.",
  "image": "assets/img/event-seminar.svg",
  "registration": "https://forms.gle/..."
}
```

- **Date:** leave it as `""` to show "TBA".
- **Past events:** they move to the Past events section automatically once their date has passed.
- **Registration:** this can be a Google Form or another sign-up link.

## Important: keep JSON valid

- Every entry needs a comma between it and the next one.
- The last entry has no trailing comma.

If a page shows nothing after an edit, paste the file into jsonlint.com to find the mistake.

## Settings (top of `assets/js/app.js`)

- **`email`**: the contact address shown on the site.
- **`web3formsKey`**: paste a free key from web3forms.com and the contact form will email enquiries to you. Without a key, visitors are shown a ready-to-copy email instead.
- **`nprPerUsd`** and **`intlFactor`**: control how international (US$) prices are calculated from NPR prices.

## Images

All images are real figures from the founder's open-access papers (CC BY) or charts made from the open NepEMO dataset, stored in `assets/img/research/`. They are listed once in the `IMG` block of `assets/js/app.js`, with captions and credits in `CREDITS` (shown on the Research page). See section 7 of `CONTENT-MANUAL.md` to replace or add images.

## Research agenda

The four programmes (Explainable GeoAI for Earth observation, the flagship, which includes a foundational GeoAI model for Nepal's SDGs; Drones and AI for agriculture; Multi-modal data intelligence for society; NLP for low-resource languages) are defined in `PROGRAMMES` in `assets/js/app.js`. Each lists the publication ids from `data/publications.json` that it builds on.

## Preview locally

Opening `index.html` directly from your computer won't load the data files, because browsers block that. Use a local server instead:

```
python3 -m http.server
```

Then open http://localhost:8000.
