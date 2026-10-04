# ai-demos

Interactive AI demos for school and district staff, published at https://parties.github.io/ai-demos/.
Each demo is one HTML file plus the shared `assets/demo.css` and `assets/demo.js`, and works offline: no CDN, no web fonts, no external images.
Most demos follow the same three steps, top to bottom: the prompt, the files attached to it, and what the AI wrote. The layout classes are listed at the top of `assets/demo.css`.
Every record in every demo is fabricated.
In every demo, all AI output goes through one `respond()` function. It returns pre-written output today; swapping its body for a model call makes the page live.
