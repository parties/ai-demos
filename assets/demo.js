// Shared behaviour for demo pages. Load with <script src="../assets/demo.js" defer>.
// Pages fill prompts and files from their own scripts, sometimes after load and again
// on every preset change, so everything here re-runs when that content changes.
(() => {
  const watch = (el, fn) => { fn(); new MutationObserver(fn).observe(el, { childList: true, subtree: true, characterData: true }); };

  // ① Prompts: mark the "[paste ...]" placeholders so they read as "a file goes here".
  const SLOT = /\[[^\]\n]*\b(paste|pasted|attach|attached)\b[^\]\n]*\]/gi;
  document.querySelectorAll(".demo-prompt").forEach(pre => watch(pre, () => {
    if (pre.querySelector(".demo-slot") || pre.textContent.search(SLOT) < 0) return;
    pre.innerHTML = pre.textContent.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]))
      .replace(SLOT, m => `<span class="demo-slot">${m}</span>`);
  }));

  // ① Copy buttons copy every prompt in their step.
  document.querySelectorAll(".demo-copy").forEach(btn => btn.addEventListener("click", async () => {
    const text = [...btn.closest(".demo-step").querySelectorAll(".demo-prompt")].map(p => p.textContent).join("\n\n");
    try { await navigator.clipboard.writeText(text); btn.textContent = "Copied"; }
    catch { btn.textContent = "Select the text and copy it"; }
    setTimeout(() => { btn.textContent = "Copy the prompt"; }, 2500);
  }));

  // ② Files: long files get a fade and an "Open full file" button that opens the viewer.
  const viewer = document.createElement("dialog");
  viewer.className = "demo-viewer";
  viewer.setAttribute("aria-labelledby", "demo-viewer-title");
  viewer.innerHTML = '<div class="demo-viewer-head"><h2 id="demo-viewer-title"></h2>' +
    '<button type="button" class="demo-viewer-close">Close</button></div><div class="demo-viewer-body"></div>';
  document.body.append(viewer);
  let shown = null; // the .demo-file the viewer is showing

  const fill = file => {
    viewer.querySelector("h2").textContent = file.querySelector(".demo-file-tab").textContent;
    viewer.querySelector(".demo-viewer-body").replaceChildren(...[...file.querySelector(".demo-file-body").childNodes].map(n => n.cloneNode(true)));
  };
  const close = () => viewer.open && viewer.close();
  viewer.addEventListener("close", () => { document.body.classList.remove("demo-viewer-docked"); shown?.querySelector(".demo-file-open")?.focus(); shown = null; });
  viewer.querySelector(".demo-viewer-close").addEventListener("click", close);
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); }); // a docked (non-modal) dialog ignores Escape on its own

  // Exposed so pages can open a file at a spot, e.g. a cited section: DemoViewer.open(fileEl, "#sec-4")
  window.DemoViewer = {
    open(file, target) {
      if (viewer.open) viewer.close();
      shown = file;
      fill(file);
      if (matchMedia("(min-width: 1100px)").matches) { viewer.show(); document.body.classList.add("demo-viewer-docked"); }
      else viewer.showModal();
      const body = viewer.querySelector(".demo-viewer-body");
      const spot = target && body.querySelector(target);
      if (spot) spot.scrollIntoView({ block: "center" }); else body.scrollTop = 0;
      return body;
    }
  };

  document.querySelectorAll(".demo-file").forEach(file => {
    const body = file.querySelector(".demo-file-body");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "demo-file-open";
    btn.textContent = "Open full file";
    btn.addEventListener("click", () => DemoViewer.open(file));
    body.after(btn);
    const check = () => {
      const long = body.scrollHeight > body.clientHeight + 4;
      file.classList.toggle("is-long", long);
      btn.hidden = !long;
      if (shown === file) fill(file); // a preset changed the file while it was open
    };
    watch(body, check);
    new ResizeObserver(check).observe(body); // un-hiding or resizing changes the answer too
  });
})();
