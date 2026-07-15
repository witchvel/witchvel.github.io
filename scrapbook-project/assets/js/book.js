/* ==========================================================================
   SCRAPBOOK CONFIG
   -----------------------------------------------------------------------
   Page 1 is the COVER — it lives on cover.html, not here.

   Everything below is an ordered list of your journal pages. To add a
   new entry:
     1. Save your new page as a PNG in assets/images/ with ANY unique
        name (it never needs to change again, even if you add more
        pages before or after it).
     2. Add one line to the PAGES list below, in the position where you
        want it to appear. Set "chapter" to whichever chapter it
        belongs to.

   You never need to rename existing files or renumber anything —
   the order on screen is just the order of this list, top to bottom.
   ========================================================================== */

const IMAGE_FOLDER = 'assets/images';

const PAGES = [
  { file: 'journal-01.png', chapter: 'Journal' },
  { file: 'journal-02.png', chapter: 'Journal' },
  { file: 'journal-03.png', chapter: 'Journal' },
  { file: 'dreams-01.png',  chapter: 'Dreams'  },
  { file: 'journal-04.png', chapter: 'Journal' },
  { file: 'dreams-02.png',  chapter: 'Dreams'  },
];

// The label shown on each chapter's tab (order here doesn't matter —
// tabs always display left-to-right / top-to-bottom in reading order,
// this just controls the text shown).
const CHAPTER_LABELS = {
  Journal: 'Journal',
  Dreams: 'Dreams',
};

/* ========================================================================== */

const stage = document.getElementById('pageStage');
const counter = document.getElementById('pageCounter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const tabsEl = document.getElementById('chapterTabs');

const FIRST_JOURNAL_PAGE = 2; // page 1 is the cover
const lastPage = FIRST_JOURNAL_PAGE + PAGES.length - 1;

function pageSrc(pageNum) {
  const entry = PAGES[pageNum - FIRST_JOURNAL_PAGE];
  return entry ? `${IMAGE_FOLDER}/${entry.file}` : null;
}

function chapterAt(pageNum) {
  const entry = PAGES[pageNum - FIRST_JOURNAL_PAGE];
  return entry ? entry.chapter : null;
}

// current = the left/top page number of the spread currently shown
let current = FIRST_JOURNAL_PAGE;
const startParam = parseInt(new URLSearchParams(location.search).get('page'), 10);
if (startParam && startParam >= FIRST_JOURNAL_PAGE && startParam <= lastPage) {
  const offset = startParam - FIRST_JOURNAL_PAGE;
  current = FIRST_JOURNAL_PAGE + (offset - (offset % 2));
}

function preload(n) {
  const src = pageSrc(n);
  if (!src) return;
  const img = new Image();
  img.src = src;
}

function renderEmptyState() {
  stage.innerHTML = `
    <div class="book-empty">
      No journal pages yet.<br>
      Add PNGs to <code>assets/images/</code> and list them in the
      <code>PAGES</code> array inside <code>assets/js/book.js</code>.
    </div>`;
  counter.textContent = '';
  prevBtn.disabled = true;
  nextBtn.disabled = true;
}

function makeLeaf(pageNum, side) {
  const leaf = document.createElement('div');
  leaf.className = `leaf leaf-${side}`;

  const src = pageSrc(pageNum);
  if (!src) return leaf; // no page here (odd page count) - leave blank

  const img = document.createElement('img');
  img.alt = `Journal page ${pageNum}`;
  img.src = src;
  img.onload = () => requestAnimationFrame(() => img.classList.add('is-visible'));
  img.onerror = renderEmptyState;
  leaf.appendChild(img);
  return leaf;
}

function render() {
  if (!PAGES.length) {
    renderEmptyState();
    return;
  }

  const leftPage = current;
  const rightPage = current + 1;

  stage.innerHTML = '';
  stage.appendChild(makeLeaf(leftPage, 'left'));
  const spine = document.createElement('div');
  spine.className = 'spine';
  stage.appendChild(spine);
  stage.appendChild(makeLeaf(rightPage, 'right'));

  const label = rightPage <= lastPage
    ? `Pages ${leftPage}\u2013${rightPage} of ${lastPage}`
    : `Page ${leftPage} of ${lastPage}`;
  counter.textContent = label;

  prevBtn.disabled = current <= FIRST_JOURNAL_PAGE;
  nextBtn.disabled = current + 2 > lastPage;

  const url = new URL(location);
  url.searchParams.set('page', current);
  history.replaceState(null, '', url);

  preload(current - 2);
  preload(current - 1);
  preload(current + 2);
  preload(current + 3);

  renderTabs();
}

function renderTabs() {
  if (!tabsEl) return;

  // find the first page number where each chapter begins
  const chapterStarts = new Map();
  for (let n = FIRST_JOURNAL_PAGE; n <= lastPage; n++) {
    const ch = chapterAt(n);
    if (ch && !chapterStarts.has(ch)) chapterStarts.set(ch, n);
  }
  if (!chapterStarts.size) { tabsEl.innerHTML = ''; return; }

  const currentChapter = chapterAt(current);
  tabsEl.innerHTML = '';

  chapterStarts.forEach((startPage, chapterKey) => {
    const btn = document.createElement('button');
    btn.className = 'chapter-tab' + (chapterKey === currentChapter ? ' is-active' : '');
    btn.textContent = CHAPTER_LABELS[chapterKey] || chapterKey;
    btn.setAttribute('aria-label', `Go to ${chapterKey}`);
    btn.addEventListener('click', () => {
      const offset = startPage - FIRST_JOURNAL_PAGE;
      goTo(FIRST_JOURNAL_PAGE + (offset - (offset % 2)));
    });
    tabsEl.appendChild(btn);
  });
}

function goTo(n) {
  if (n < FIRST_JOURNAL_PAGE || n > lastPage) return;
  current = n;
  render();
}

prevBtn.addEventListener('click', () => goTo(current - 2));
nextBtn.addEventListener('click', () => goTo(current + 2));

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') goTo(current - 2);
  if (e.key === 'ArrowRight') goTo(current + 2);
});

// swipe support for touch devices
let touchStartX = null;
const SWIPE_THRESHOLD = 40;

document.getElementById('book').addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

document.getElementById('book').addEventListener('touchend', (e) => {
  if (touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > SWIPE_THRESHOLD) {
    dx < 0 ? goTo(current + 2) : goTo(current - 2);
  }
  touchStartX = null;
}, { passive: true });

render();
