# Demo layout restyle: shared stylesheet, clear prompt → files → output, plainer copy

## Context

Eric reviewed the published gallery (https://parties.github.io/ai-demos/) and found four problems:

1. The pages look flat and characterless.
2. Titles and intros are vague and insider-ish ("Where it fails, and how you catch it": what is "it"?). They should read like a teacher explaining a task, not a cool-guy tagline.
3. The index is a wall of cards that crowds a laptop screen. He wants a list view, with a toggle to cards.
4. On each demo it is not clear which part is the prompt, which is the attached context, and which is what the AI produced. 28 of the 30 demos hide the prompt behind "Show the prompt". The input and output columns look alike.

Intended outcome: every demo reads top to bottom as ① the prompt you type, ② the files you attach, ③ what the AI wrote, and the AI output is unmistakably set apart. All pages share one stylesheet of named layout pieces, so the next look change is one edit.

Scope: `index.html`, `framework.html`, the 30 pages in `demos/`, `README.md`, and a new `assets/demo.css`.

## Decisions (answered by Eric, 2026-10-04)

1. One shared local stylesheet, `assets/demo.css`, that names each main piece of the demo layout and the related shared styles. Pages keep only page-specific rules inline.
2. Look: warm and textbook-like, specific to schools (see Design tokens). No web fonts and no CDN. Pages must still work offline.
3. Layout: three numbered steps stacked top to bottom. The prompt is always visible, and the "Show the prompt" toggle is removed. The output gets its own tinted panel, a heavy border and an "AI-generated" label. The side-by-side input/output columns go away.
4. Rewrite scope: the page `<title>`, `<h1>`, intro, section headings, index blurbs and footers. Pre-written AI output (`CANNED`, output strings) is not edited.
5. Index: a list/cards toggle. The list is the default. The choice is remembered in `localStorage`, inside try/catch.
6. Pilot on `index.html`, `demos/where-it-fails.html` and `demos/board-memo-draft.html`. Stop for Eric's review before the rollout.

## Assumptions (taken as defaults, not asked)

- **Long inputs: preview plus file viewer** (Eric asked for this, 2026-10-04).
  - In step ②, each file shows a short preview: about 10 lines, with a fade at the bottom. The fade appears only when the file is longer than the preview.
  - Each file has an "Open full file" button. It opens a file viewer that shows the whole document, with the file name as its title.
  - The viewer is a native `<dialog>`. Its content is the same text the page already holds, so there are no extra files and no `fetch`, and `file://` still works.
  - On screens 1100px and wider, the viewer opens as a non-modal panel docked to the right (`dialog.show()`), so the AI output stays readable beside the full source.
  - On narrower screens, it opens as a full-screen modal (`showModal()`). Escape and a Close button dismiss it.
  - This replaces the sticky input column that 13 pages use now, and avoids a scroll box nested inside the page scroll.
- **Comparing against the original.** `where-it-fails` and the click-to-see-source pages (program-report, staff-faq) teach comparing the output with its source. On wide screens, the docked viewer gives that side-by-side view on demand. Click-to-source pages open the viewer at the cited row or section (scroll into view plus the existing `.hl`/`.hit` highlight).
- **Shared script.** The viewer is the only shared behaviour, so `assets/demo.js` holds it (about 25 lines). It also holds the prompt Copy button. Pages link it with a `<script src>` next to the stylesheet. Each page's own logic stays inline.
- **Pages that need more than one step of a kind.**
  - Pages with several prompts (directive-to-building, pd-followthrough) show each prompt in step ①, labelled with the output it makes.
  - Pages with several outputs (communications, every-channel, pd-followthrough, directive-to-building, adoption-review, catalog-descriptions) keep their outputs side by side inside step ③.
  - In meeting-rehearsal, AI turns get the AI style and your turns stay neutral.
  - In interview-then-build, each of its two flows gets its own ①②③.
- **Pages with no prompt.**
  - communications gets a prompt written in the four-part format the other pages use. This is new content, so it is flagged at the rollout review.
  - deidentified-patterns keeps its 3-step wizard. Only its AI-produced step gets the AI panel and tag.
  - framework.html keeps its builder: "What you type" becomes step ① and the result becomes step ③. Its explainer sections below stay as they are, apart from the copy pass.
- **JavaScript hooks stay.** Every ID, `data-*` attribute, `aria-pressed` and JS-toggled class listed in the scan stays: `#prompt`/`#prompt-text`, `#out`, `#presets`, `.checked`, `.sent.on`, `.hit`, `.claim.checked`, `.msg.draft`, `.count.ok/.over`, and the rest. Only the wrapping markup and the layout class names change. The `respond()` contract in the README is untouched.
- **Back link.** Every demo gets an "All demos" link to `../index.html`. Today no demo links back to the index.
- **README wording.** "Each demo is a single HTML file" becomes "Each demo is one HTML file plus the shared `assets/demo.css`; nothing loads from the internet."

## Design tokens (`assets/demo.css` `:root`)

The subject is school and district office paperwork: manila folders, memos, packets. The attached-files step uses that vernacular. The design is bold in one place only: a numbered rail runs down the left of the three steps, and the output panel breaks out of it. Everything else stays quiet.

| Token | Value | Role |
|---|---|---|
| `--page` | `#F4F5F0` | page background, cool recycled-paper grey (not cream) |
| `--ink` | `#1E2832` | text, slate blue-black |
| `--muted` | `#5B6670` | secondary text |
| `--rule` | `#D3D8D0` | borders and the step rail |
| `--card` | `#FFFFFF` | neutral boxes |
| `--accent` | `#2E4A7A` | buttons, links, step ① border (a white "message box" like a chat composer) |
| `--file` / `--file-bg` | `#A8823F` / `#F3E8CF` | step ②: manila folder; each file is a folder whose tab shows its name |
| `--ai` / `--ai-bg` | `#16705F` / `#E4F1ED` | step ③: deep teal, 4px border, "AI-generated" tag. The only teal on the page. |
| `--warn`, `--warn-bg`, `--bad`, `--bad-bg`, `--good`, `--good-bg`, `--mark` | one value each | Today these names carry 2–3 different values across pages (`--warn-bg` has 3). They are normalized here and pages stop redeclaring them. |

Type: headings use a system serif stack (`Charter, "Bitstream Charter", "Sitka Text", Cambria, Georgia, serif`), which ships with macOS and Windows. Body uses the existing `system-ui` sans at 19px/1.55. Labels are sentence case. Drop the all-caps, letter-spaced "eyebrow" headings; about 29 pages use them now, under 4 selectors. Main column max ~72rem; prose max ~70ch. Content is left-aligned.

Wireframe (all widths):

```
All demos
H1  plain task title
Intro: what the task is, who does it, what this page shows
[preset buttons ...]
 ①─ The prompt ─────────────── [Copy]   white box, slate border
 │
 ②─ The files you attach                manila folders, tab = file name
 │   ┌tab┐ last month's memo            capped height, own scroll
 │
 ③━ What the AI wrote  [AI-generated]   teal panel, heavy border
 ┃   ...output...
Before you use it: the human check     (promoted from the footer)
footer: fabricated records, works offline
```

## Named components in `assets/demo.css`

Every shared component has a `demo-` prefix. The scan found about 25 class names that mean different things on different pages (`.steps`, `.flag`, `.doc`, `.box`, `.notes`, `.side`, `.chip`, `.tiles`, …). Unprefixed shared names would collide with them.

- **Base** (element selectors): `body`, `h1`/`h2`, `button` and `button[aria-pressed="true"]`, `table`, `:focus-visible`, `[hidden] { display: none !important }`, `prefers-reduced-motion`. The `[hidden]` rule also fixes a live bug: where-it-fails' hidden findings list renders today, because its `display: grid` overrides `hidden`.
- **Page frame**: `.demo` (the main column), `.demo-back`, `.demo-head` with `.demo-intro`, `.demo-presets` (replaces the 5 `.controls`/`.group`/`.presets` variants), `.demo-foot`.
- **Steps**:
  - `.demo-steps` is the rail. Each step is `.demo-step` plus one of `--prompt`, `--files` or `--output`, with a `.demo-step-title`. The number comes from a CSS counter.
  - Prompt pieces: `.demo-prompt` (the `<pre>`; replaces the 5 prompt-box variants) and `.demo-copy`.
  - File pieces: `.demo-file`, `.demo-file-tab`, `.demo-file-body` (the preview with fade) and `.demo-file-open`.
  - The viewer: `.demo-viewer` (the `<dialog>`, docked right at 1100px and up, full screen below).
  - Output pieces: `.demo-ai-tag`, `.demo-drafting` (replaces 3 variants) and `.demo-outputs` (side-by-side outputs inside step ③).
- **After the steps**: `.demo-before-use` (the human check).
- **Shared output bits** that recur on many pages: `.demo-tiles`/`.demo-tile` (11 pages), `.demo-flag` (9 pages, 3 looks today), `.demo-chip`, `.demo-tablewrap`, `.demo-meta`.
- **Index**: `.gallery` with `.gallery--list` or `.gallery--cards`, and `.view-toggle`.

Page-specific rules stay in each page's inline `<style>`, using the shared tokens. Examples: the memo letterhead, the four-part colour segments, habit cards, charts, the schedule grid.

## Steps

0. Load the `eric-skills:workstream` skill and open a stream for this plan. Create branch `restyle/demo-layout`. Log deviations with `stream note`. `implementation-notes.md` gets one line naming the stream.
1. Write `assets/demo.css` with the tokens and components above. Write `assets/demo.js`, which does two things:
   - It finds every `.demo-file` and adds an "Open full file" button to each file that overflows its preview. The button opens the viewer with the file's content.
   - It wires each `.demo-copy` button to copy the prompt text. On failure it says "Select the text and copy it" instead.
2. **Pilot: `index.html`.**
   - Link the stylesheet.
   - Rewrite the group headings and every blurb in a plain teacher voice. A blurb says what the staff member gives the AI and what they get back. Fix the page count: the intro says 30 demos, and there are 30 demo pages plus the framework.
   - Add `.view-toggle` (List / Cards): two `aria-pressed` buttons and a few lines of JS. The JS swaps the gallery class and saves the choice to `localStorage` inside try/catch. Without script or storage, the list view shows.
   - A list row is the title (a link) plus a one-line blurb. Cards are the current grid, restyled.
3. **Pilot: `demos/where-it-fails.html` and `demos/board-memo-draft.html`.**
   - Replace the `.cols`/`.col`/`.panel` markup with `.demo-steps`:
     - ① the prompt, always visible, with a Copy button.
     - ② the files, one `.demo-file` each. Board memo: "Your notes" and "Last month's memo". Where-it-fails: the policy, the budget table, or "No file attached" for the law question.
     - ③ the output.
   - Remove `#toggle-prompt`, its handler and the `hidden` attribute on the prompt. Keep the prompt IDs the JS writes into. Delete the inline rules that `demo.css` now covers.
   - Rewrite the copy. Example: "Where it fails, and how you catch it" becomes "AI answers that look right but aren't: how to check them".
   - Move the footer's human-check sentence into `.demo-before-use`.
4. **Checkpoint.**
   - Commit the pilot and push the branch.
   - Screenshot the three pages at 1280×800 and 390×844.
   - Run `stream ask` for Eric's review of the look and the copy. Stop here until he approves.
5. **Rollout** (after approval). Convert the remaining 28 demos and `framework.html` in batches, one batch per layout family. Run the verification script after each batch.
   - **a. Two-column, sticky input**: board-packet-brief, data-meeting-prep, decision-brief, resource-guide, survey-themes, intervention-templates, contract-language, interview-kit, job-posting, staff-faq.
   - **b. `.io` with side panels**: helpdesk-howto, outage-notice, spreadsheet-formulas, vendor-privacy-review. The `.side` panels go after step ③.
   - **c. Unboxed or already stacked**: holding-statement, newsletter-assembly, program-report, adoption-review, schedule-conflicts, standards-alignment.
   - **d. Several outputs**: communications (with its new prompt), directive-to-building, pd-followthrough, every-channel, catalog-descriptions.
   - **e. Interactive**: meeting-rehearsal, interview-then-build, deidentified-patterns, `framework.html`.
6. Update the README line. Delete `implementation-notes.md`.

## Verification

- `grep -L 'assets/demo.css' index.html framework.html demos/*.html` prints nothing.
- `grep -l 'toggle-prompt' demos/*.html` prints nothing.
- `grep -nE '(src|href)="https?://|@import' index.html framework.html demos/*.html assets/demo.css` prints nothing.
- A Playwright script (in the scratchpad, not the repo) opens every page over `file://` and checks:
  - It clicks every preset, mode and tab button and waits for `.demo-step--output` to fill. It fails on any console error and on any request that is not `file://`.
  - It screenshots each page at 1280×800 and 390×844, and asserts there is no horizontal scroll at 390px.
  - The index view choice survives a reload.
  - where-it-fails' findings list is not displayed until "Check it" is pressed.
  - The board-memo pilot's "Last month's memo" shows "Open full file". The viewer opens docked at 1280px and full screen at 390px, and Escape closes it.
- Eric reviews the pilot screenshots at the checkpoint and the full set before merge.

Done when: all 30 demos, `framework.html` and `index.html` link `assets/demo.css` (and every demo with files links `assets/demo.js`), no page contains `toggle-prompt`, and the Playwright pass reports 0 console errors and 0 network requests.   Eric verifies: opens the published index on his laptop, toggles list/cards, and opens three demos to confirm the prompt, files and AI output are clearly separate.

## Revision (2026-10-04, after the pilot review)

Eric approved the pilot layout, then changed the scope. The public gallery becomes a sales showcase. The full set is kept for paid client work.

- **Showcase (10, stay public):**
  - where-it-fails
  - board-memo-draft
  - meeting-rehearsal
  - job-posting
  - vendor-privacy-review
  - standards-alignment
  - deidentified-patterns
  - directive-to-building
  - communications
  - program-report
- **Off the public site:** the other 20 demos and `framework.html`. The repo is public and Pages serves `main` from the root, so any file on `main` is public. They are deleted from `main` on this branch. They stay recoverable from the tag `full-gallery-2026-10-04`, which points at the last commit that has all of them.
- **Restyle only the showcase demos.** Step 5's batches are replaced by the 8 showcase pages still to convert. Merge PR #1 once, after they are done.
- **Next, on a new branch:** a Claude walkthrough prototype for the board memo. It uses real Claude screenshots that Eric captures.

Done when (revised): the 10 showcase demos and `index.html` link `assets/demo.css`, the index lists exactly those 10 plus the workshop link, no remaining page contains `toggle-prompt`, and the Playwright pass reports 0 console errors and 0 network requests.   Eric verifies: opens the published index after merge and spot-checks three demos.
