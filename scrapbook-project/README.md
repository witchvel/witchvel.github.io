# ✦ Digital Scrapbook

A vintage, purplish, magical digital scrapbook — a Links/about page, a cover
page styled like a book on a table, and an open-book journal viewer — built
to be hosted for free on **GitHub Pages**.

## Structure

```
scrapbook-project/
├── index.html            ← the "Links" landing page (about me + links)
├── cover.html             ← the cover page (half-screen desktop, stacked mobile)
├── book.html              ← the journal viewer (open-book spread)
├── art-commissions.html   ← placeholder "coming soon" page
├── assets/
│   ├── css/style.css      ← all styling (palette, fonts, layout)
│   ├── js/book.js         ← journal spread logic + page config
│   └── images/            ← your scrapbook PNGs + table-bg.jpg go here
└── README.md
```

## How the pages flow

`index.html` (Links) → **Journal** button → `cover.html` (page 1, the cover)
→ **Open the Journal** button → `book.html` (page 2 onward, shown as an
open book spread).

## Adding your art

### The cover (page 1)
- Export your cover as `assets/images/page-01.png` — same spec as your
  other pages (1080×1920, see below).
- Replace `assets/images/table-bg.jpg` with your own "table" background
  image. I've put a plain placeholder texture there so the page doesn't
  break — swap it for your art any time. A wide image (roughly
  2400×1600 or wider) works best since it needs to stretch tall on
  desktop and shrink to a short strip on mobile.

### The journal pages (page 2 onward)
Pages are no longer numbered by filename — you control the order with a
list in the code instead, so **you never need to rename files** when you
insert a new entry.

1. Export your page as a PNG, same size as before: **1080×1920 px**.
2. Save it in `assets/images/` with any name you like — it never has to
   change again (e.g. `journal-05.png`, `dreams-03.png`, whatever makes
   sense to you).
3. Open `assets/js/book.js` and find the `PAGES` list near the top:
   ```js
   const PAGES = [
     { file: 'journal-01.png', chapter: 'Journal' },
     { file: 'journal-02.png', chapter: 'Journal' },
     { file: 'journal-03.png', chapter: 'Journal' },
     { file: 'dreams-01.png',  chapter: 'Dreams'  },
     { file: 'journal-04.png', chapter: 'Journal' },
     { file: 'dreams-02.png',  chapter: 'Dreams'  },
   ];
   ```
4. Add one line, in the position where the new page should appear on
   screen. That's it — nothing else needs to change.

   For example, say you've just finished a new Journal entry and want
   it to land right after `journal-03.png` but before the first Dreams
   page — just insert your new line between them:
   ```js
   { file: 'journal-01.png', chapter: 'Journal' },
   { file: 'journal-02.png', chapter: 'Journal' },
   { file: 'journal-03.png', chapter: 'Journal' },
   { file: 'journal-04-new.png', chapter: 'Journal' },  // <- just added this line
   { file: 'dreams-01.png',  chapter: 'Dreams'  },
   { file: 'journal-04.png', chapter: 'Journal' },
   { file: 'dreams-02.png',  chapter: 'Dreams'  },
   ```
   Every page number, chapter tab, and spread pairing recalculates itself
   automatically from this list — no renumbering, ever.

### Chapter tabs
The little bookmark tabs on the side of the book (desktop) / bottom row
(mobile) are generated automatically from whichever chapters appear in
`PAGES`. If you want to rename what shows on the tab itself without
changing your internal chapter key, edit `CHAPTER_LABELS` right below
the `PAGES` list:
```js
const CHAPTER_LABELS = {
  Journal: 'Journal',
  Dreams: 'Journal of Dreams',
};
```

### Leaving room for the spine
On desktop, journal pages are shown two at a time, side by side, like an
open book — so whichever page lands in the *inner* position (next to the
crease) needs a little breathing room there. Since pages alternate sides
as you flip through, the safest approach is to keep your important
content (faces, key text) within the **center ~880px** of each 1080px-wide
canvas — leaving roughly 100px clear on **both** the left and right edges.
Decorative elements (borders, texture, torn edges) can still bleed to the
very edge; it's just the important content that needs the margin.

### About image sizing
The viewer never crops your PNGs — it scales each one to fit while
keeping the whole image visible, so nothing you've drawn gets cut off.
On phones shaped close to 9:16, pages fill the screen edge to edge.

## Editing the Links page

Open `index.html` and edit the name, tagline, about text, and link URLs,
same as before. The **Journal** link now points to `cover.html`.

## Colors & fonts (in `assets/css/style.css`)

| Token | Hex | Used for |
|---|---|---|
| `--ink-plum` | `#241733` | page background |
| `--wine` | `#4B2142` | link buttons / accents |
| `--parchment` | `#F1E7D3` | the "locket" card background |
| `--lilac` | `#B79FCC` | soft accent |
| `--gold` | `#C9A961` | borders, dividers, icons |

Fonts are pulled from Google Fonts: **Cinzel / Cinzel Decorative** for
headings, **EB Garamond / Cormorant Garamond** for body text.

## Publishing with GitHub Pages

1. Create a new GitHub repository and push everything in this folder to it.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`.
4. Save. GitHub will give you a URL like
   `https://yourusername.github.io/your-repo-name/` within a minute or two.
5. Your Links page (`index.html`) will be the homepage automatically.

## Notes

- Everything is plain HTML/CSS/JS — no build step, no dependencies to install.
- The journal viewer supports arrow-key navigation, on-screen prev/next
  buttons, and touch swipe on mobile — moving two pages (one full spread)
  at a time.
- `book.html?page=4` will jump straight to the spread starting at page 4,
  and the URL updates as you navigate, so you can link directly to a
  specific spread.
