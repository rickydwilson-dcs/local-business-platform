// mollyxpaolo prototype — gallery, tone switch, lightbox, selection and downloads.
// Plain ES modules, no build step. Data comes from data.js (window.MXP).

const D = window.MXP;
const $ = (s, r = document) => r.querySelector(s);
const html = document.documentElement;
const TONES = ["colour", "sepia", "bw"];
const TONE_FILE = { colour: "colour", sepia: "sepia", bw: "black-and-white" };
// Average bytes per photo by tone and size, from the upload dry run (5,252 objects, 6.71GB).
const AVG_MB = { "4k": { colour: 1.37, sepia: 1.37, bw: 1.25 }, original: { colour: 4.9, sepia: 5.4, bw: 3.2 } };

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

/* ---------------- Data ---------------- */

// Admin choices (admin.html writes these in the prototype; production reads them from the store).
let overrides = {};
try { overrides = JSON.parse(store.get("mxp-admin") || "{}"); } catch {}
const photos = D.photos
  .map((p) => ({ ...p, featured: overrides[p.id] ? overrides[p.id] === "featured" : p.featured }))
  .filter((p) => overrides[p.id] !== "hidden");
const byId = new Map(photos.map((p) => [p.id, p]));
const ar = (p) => p.w / p.h;

const url = (p, tone, variant) =>
  `${D.base}${tone}/${variant}/${p.id}.${variant === "4k" || variant === "original" ? "jpg" : "webp"}`;
const srcset = (p, tone) =>
  [480, 1080, 2048].map((w) => `${url(p, tone, `w${w}`)} ${Math.min(w, p.w)}w`).join(", ");
const clock = (t) => {
  if (!t) return "";
  let [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, "0")} ${ap}`;
};

let tone = html.dataset.tone || "colour";

/* ---------------- Gate ---------------- */

function gate() {
  const params = new URLSearchParams(location.search);
  const k = params.get("k");
  if (k && k.length >= 8) {
    // Production: the server verifies an HMAC token, sets an httpOnly cookie and redirects.
    // Here we accept any long-enough token and strip it, so the clean-URL behaviour is visible.
    sessionStorage.setItem("mxp-ok", "1");
    params.delete("k");
    history.replaceState(null, "", location.pathname + (params.toString() ? `?${params}` : "") + location.hash);
  }
  if (sessionStorage.getItem("mxp-ok")) return;
  const g = $("#gate");
  g.hidden = false;
  const first = photos.find((p) => p.featured) || photos[0];
  $("#gateBg").style.backgroundImage = `url(${url(first, tone, "w480")})`;
  document.body.style.overflow = "hidden";
  setTimeout(() => $("#gateInput").focus(), 50);
  $("#gateForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if ($("#gateInput").value.trim().toLowerCase() === "vegas") {
      sessionStorage.setItem("mxp-ok", "1");
      g.hidden = true;
      document.body.style.overflow = "";
    } else {
      $("#gateErr").textContent = "That's not it. Check the message you were sent.";
    }
  });
}

/* ---------------- Tiles ---------------- */

function tile(p, sizes, { stamp = true, fav = true } = {}) {
  const b = document.createElement("button");
  b.className = "tile";
  b.type = "button";
  b.dataset.id = p.id;
  b.style.setProperty("--ar", ar(p).toFixed(4));
  b.style.backgroundImage = `url(${p.ph[tone]})`;
  b.setAttribute("aria-label", `Photo ${p.n}${p.t ? `, ${clock(p.t)}` : ""}`);
  const img = document.createElement("img");
  img.alt = "";
  img.loading = "lazy";
  img.decoding = "async";
  img.sizes = sizes;
  img.srcset = srcset(p, tone);
  img.dataset.id = p.id;
  img.addEventListener("load", () => img.classList.add("loaded"));
  b.append(img);
  if (stamp && p.t) b.insertAdjacentHTML("beforeend", `<span class="stamp">${clock(p.t)}</span>`);
  if (fav && p.featured) b.insertAdjacentHTML("beforeend", `<span class="fav">Favourite</span>`);
  b.insertAdjacentHTML("beforeend", `<span class="check" aria-hidden="true"></span>`);
  if (picked.has(p.id)) b.classList.add("picked");
  return b;
}

/* ---------------- The mixed layout ---------------- */

const mqMobile = matchMedia("(max-width: 700px)");

function buildRows(list, mobile) {
  const rows = [];
  const patterns = mobile ? ["pair", "solo", "pair", "pair", "solo"] : ["pair", "trio", "solo", "pair", "trio", "pair", "inset"];
  const maxSum = mobile ? 2.3 : 4.3;
  let i = 0, k = 0, flip = false, pairs = 0;
  while (i < list.length) {
    const p = list[i];
    if (p.featured) {
      rows.push(ar(p) > 1.2 || mobile ? { type: "full", items: [p] } : { type: "inset", items: [p], flip: (flip = !flip) });
      i++;
      continue;
    }
    const pat = patterns[k++ % patterns.length];
    if (pat === "solo" || pat === "inset") {
      if (ar(p) > 1.2) rows.push({ type: pat === "solo" ? "full" : "inset", items: [p], flip: (flip = !flip) });
      else rows.push({ type: mobile ? "row" : "inset", items: [p], flip: (flip = !flip) });
      i++;
      continue;
    }
    // Two landscapes side by side are too small on a phone; stagger them instead, one pushed
    // left and one pushed right, so a run of landscapes doesn't become a plain stack.
    if (mobile && pat === "pair" && ar(p) > 1.2 && list[i + 1] && !list[i + 1].featured && ar(list[i + 1]) > 1.2) {
      rows.push({ type: "row", items: [p], indent: "stagger-l" }, { type: "row", items: [list[i + 1]], indent: "stagger-r" });
      i += 2;
      continue;
    }
    const want = pat === "trio" ? 3 : 2;
    const items = [];
    let sum = 0;
    while (items.length < want && i < list.length && !list[i].featured) {
      const a = ar(list[i]);
      if (items.length && sum + a > maxSum) break;
      items.push(list[i]);
      sum += a;
      i++;
    }
    // A single landscape left over on a phone reads best edge to edge.
    if (items.length === 1 && mobile && ar(items[0]) > 1.2) { rows.push({ type: "full", items }); continue; }
    const indent = !mobile && items.length === 2 ? (pairs++ % 2 ? "indent-r" : "indent-l") : "";
    rows.push({ type: "row", items, indent: pairs % 3 === 0 ? "" : indent });
  }
  return rows;
}

function renderRows(container, list) {
  const mobile = mqMobile.matches;
  container.textContent = "";
  for (const r of buildRows(list, mobile)) {
    const row = document.createElement("div");
    row.className = `row ${r.type === "row" ? "" : r.type} ${r.indent || ""} ${r.flip ? "flip" : ""}`.trim();
    const sum = r.items.reduce((s, p) => s + ar(p), 0);
    row.style.setProperty("--sum", sum.toFixed(4)); // feeds the height cap in styles.css
    row.style.setProperty("--n", r.items.length);
    for (const p of r.items) {
      let sizes;
      if (r.type === "full") sizes = "100vw";
      else if (r.type === "inset") sizes = mobile ? "100vw" : "58vw";
      else if (r.indent && r.indent.startsWith("stagger")) sizes = "80vw";
      else sizes = `${Math.ceil((ar(p) / sum) * (mobile ? 100 : 92))}vw`;
      row.append(tile(p, sizes));
    }
    if (r.type === "inset") {
      const p = r.items[0];
      const note = document.createElement("div");
      note.className = "inset-note";
      note.innerHTML = p.featured
        ? `<span>A favourite</span><strong>${clock(p.t) || "Las Vegas"}</strong><span>Photograph ${p.n}</span>`
        : `<strong>${clock(p.t)}</strong><span>Photograph ${p.n}</span>`;
      row.append(note);
    }
    container.append(row);
  }
}

/* ---------------- Page ---------------- */

let order = []; // the lightbox order: chapters top to bottom

function render() {
  const nav = $("#chapterNav");
  const host = $("#chapters");
  nav.textContent = "";
  host.textContent = "";
  order = [];

  D.chapters.forEach((c, ci) => {
    const list = photos.filter((p) => p.chapter === c.id);
    if (!list.length) return;
    order.push(...list);
    const times = list.map((p) => p.t).filter(Boolean);
    const span = times.length ? `${clock(times[0])} – ${clock(times[times.length - 1])}` : "";
    nav.insertAdjacentHTML("beforeend", `<li><a href="#ch-${c.id}">${c.title}<span>${list.length}</span></a></li>`);

    const sec = document.createElement("section");
    sec.className = "chapter";
    sec.id = `ch-${c.id}`;
    sec.innerHTML = `
      <header class="chapter-head">
        <div class="chapter-kicker"><span>${c.kicker}</span><span class="time">${span}</span><span>${list.length} photos</span></div>
        <h2>${c.title}</h2>
        <p class="chapter-blurb">${c.blurb}</p>
      </header>
      <div class="rows"></div>`;
    renderRows($(".rows", sec), list);
    host.append(sec);

    // The film belongs to the ceremony, so it sits straight after the first chapter.
    if (ci === 0) host.append($("#film"));
  });

  const ribbon = $("#ribbon");
  ribbon.textContent = "";
  for (const p of photos.filter((p) => p.featured)) {
    ribbon.append(tile(p, `calc(52vh * ${ar(p).toFixed(3)})`, { fav: false }));
  }
}

/* ---------------- Hero ---------------- */

let heroTimer;
function hero() {
  const host = $("#heroImgs");
  // Lead with the bright, wide favourites. Left out: the collages (349, 350) and the photos
  // with lettering baked in (341 "A True Love Story", 347 "Just Married"), whose text collides
  // with the title. Portrait screens get the portrait favourites as well.
  const portraitScreen = matchMedia("(orientation: portrait)").matches;
  const lead = ["vk-343", "vk-348", "vk-345", "vk-342"];
  const noHero = ["vk-341", "vk-347", "vk-349", "vk-350"];
  const fav = photos.filter((p) => p.featured);
  const list = [
    ...lead.map((id) => fav.find((p) => p.id === id)).filter(Boolean),
    ...fav.filter((p) => !lead.includes(p.id) && !noHero.includes(p.id) && (portraitScreen ? ar(p) < 1 : false)),
  ];
  if (portraitScreen) list.sort((a, b) => ar(a) - ar(b)); // portraits first on a phone
  if (!list.length) list.push(...(fav.length ? fav : [photos[0]]));
  const imgs = [document.createElement("img"), document.createElement("img")];
  imgs.forEach((im) => { im.alt = ""; im.sizes = "100vw"; host.append(im); });
  let n = 0, front = 0, misses = 0;
  const show = () => {
    const p = list[n++ % list.length];
    const im = imgs[front];
    im.dataset.id = p.id;
    im.srcset = srcset(p, tone);
    im.decode().then(
      () => { misses = 0; im.classList.add("on"); imgs[1 - front].classList.remove("on"); front = 1 - front; },
      // A photo that fails to load is skipped rather than shown as a broken image.
      () => { if (++misses < list.length) show(); },
    );
  };
  show();
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) heroTimer = setInterval(show, 6500);
}

/* ---------------- Tone ---------------- */

function setTone(t) {
  if (t === tone) return;
  tone = t;
  html.dataset.tone = t;
  store.set("mxp-tone", t);
  const params = new URLSearchParams(location.search);
  params.set("tone", t);
  history.replaceState(null, "", `${location.pathname}?${params}${location.hash}`);
  for (const b of document.querySelectorAll(".tone button")) b.setAttribute("aria-checked", String(b.dataset.tone === t));

  for (const img of document.querySelectorAll("img[data-id]")) {
    const p = byId.get(img.dataset.id);
    if (!p || !img.getAttribute("srcset")) continue; // lightbox slides not yet loaded stay empty
    const next = srcset(p, t);
    const tileEl = img.closest(".tile");
    if (tileEl) tileEl.style.backgroundImage = `url(${p.ph[t]})`;
    if (img.complete && img.naturalWidth) {
      // Keep the current picture on screen until the new tone has decoded, then swap: no flash.
      const pre = new Image();
      pre.sizes = img.sizes;
      pre.srcset = next;
      pre.decode().then(() => (img.srcset = next), () => (img.srcset = next));
    } else {
      img.srcset = next;
    }
  }
  for (const s of document.querySelectorAll(".lb-slide")) {
    const p = byId.get(s.dataset.id);
    $(".ph", s).style.backgroundImage = `url(${p.ph[t]})`;
  }
  if (lb.open) lbUpdate();
  updateTray();
}

/* ---------------- Lightbox ---------------- */

const lbEl = $("#lb");
const track = $("#lbTrack");
const lb = { open: false, i: 0, zoom: null };
const coarse = matchMedia("(pointer: coarse)").matches;

function lbBuild() {
  track.textContent = "";
  for (const p of order) {
    const s = document.createElement("div");
    s.className = "lb-slide";
    s.dataset.id = p.id;
    s.innerHTML = `<div class="ph" style="background-image:url(${p.ph[tone]})"></div>`;
    const img = document.createElement("img");
    img.alt = `Photo ${p.n}`;
    img.dataset.id = p.id;
    img.sizes = "100vw";
    img.draggable = false;
    s.append(img);
    track.append(s);
  }
}

function lbLoad(i) {
  for (let j = i - 1; j <= i + 2; j++) {
    const s = track.children[j];
    if (!s) continue;
    const img = $("img", s);
    if (!img.getAttribute("srcset")) img.srcset = srcset(order[j], tone);
  }
}

function lbUpdate() {
  const p = order[lb.i];
  const c = D.chapters.find((c) => c.id === p.chapter);
  $("#lbWhere").innerHTML = `${lb.i + 1} / ${order.length}<span>${c ? c.title : ""}${p.t ? ` · ${clock(p.t)}` : ""}</span>`;
  const n = String(p.n).padStart(3, "0");
  $("#dl4k").href = url(p, tone, "4k");
  $("#dlFull").href = url(p, tone, "original");
  $("#dl4k").setAttribute("download", `MollyxPaolo-${n}-${TONE_FILE[tone]}-4K.jpg`);
  $("#dlFull").setAttribute("download", `MollyxPaolo-${n}-${TONE_FILE[tone]}-full.jpg`);
  $("#lbPick").setAttribute("aria-pressed", String(picked.has(p.id)));
  const long = Math.max(p.w, p.h);
  $("#dl4k small").textContent = long > 3840 ? "3840 px · good for screens and prints" : `${long} px · same as full size`;
  $("#dlFull small").textContent = `${long} px · the original`;
  lbLoad(lb.i);
}

function lbOpen(id) {
  if (track.children.length !== order.length) lbBuild();
  lb.i = Math.max(0, order.findIndex((p) => p.id === id));
  lb.open = true;
  lbEl.classList.add("open");
  lbEl.classList.remove("chrome-off");
  lbEl.append($("#tone")); // compare tones on one photo without leaving the viewer
  html.style.overflow = "hidden";
  track.scrollTo({ left: lb.i * track.clientWidth, behavior: "instant" });
  lbUpdate();
  const hint = $("#lbHint");
  if (!store.get("mxp-hinted")) {
    hint.textContent = coarse ? "Swipe to browse · double-tap to zoom · swipe down to close" : "← → to browse · double-click to zoom · Esc to close";
    store.set("mxp-hinted", "1");
    setTimeout(() => (hint.textContent = ""), 4500);
  }
  $("#lbClose").focus({ preventScroll: true });
}

function lbClose() {
  unzoom();
  lb.open = false;
  lbEl.classList.remove("open");
  $("#lbMenu").classList.remove("open");
  document.body.append($("#tone"));
  html.style.overflow = "";
  const t = document.querySelector(`#chapters .tile[data-id="${order[lb.i].id}"]`);
  if (t) { t.scrollIntoView({ block: "center" }); t.focus({ preventScroll: true }); }
}

function lbGo(d) {
  const i = Math.min(order.length - 1, Math.max(0, lb.i + d));
  unzoom();
  track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
}

// Debounced with a timer rather than requestAnimationFrame, which never fires in a background tab.
let scrollTimer;
track.addEventListener("scroll", () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== lb.i) { lb.i = i; lbUpdate(); }
  }, 60);
}, { passive: true });

addEventListener("resize", () => { if (lb.open) track.scrollTo({ left: lb.i * track.clientWidth, behavior: "instant" }); });

// Zoom: double-tap / double-click zooms to the point, drag pans, double-tap again releases.
function zoomAt(img, cx, cy) {
  const r = img.getBoundingClientRect();
  lb.zoom = { img, scale: 2.6, x: 0, y: 0, ox: ((cx - r.left) / r.width) * 100, oy: ((cy - r.top) / r.height) * 100 };
  img.style.transformOrigin = `${lb.zoom.ox}% ${lb.zoom.oy}%`;
  img.style.transform = `scale(${lb.zoom.scale})`;
  lbEl.classList.add("zoomed");
}
function unzoom() {
  if (!lb.zoom) return;
  lb.zoom.img.style.transform = "";
  lb.zoom = null;
  lbEl.classList.remove("zoomed");
}

let ptr = null, lastTap = 0, tapTimer;
track.addEventListener("pointerdown", (e) => {
  ptr = { x: e.clientX, y: e.clientY, t: Date.now(), dx: 0, dy: 0, slide: e.target.closest(".lb-slide") };
  if (lb.zoom) ptr.base = { x: lb.zoom.x, y: lb.zoom.y };
});
track.addEventListener("pointermove", (e) => {
  if (!ptr) return;
  ptr.dx = e.clientX - ptr.x;
  ptr.dy = e.clientY - ptr.y;
  if (lb.zoom) {
    lb.zoom.x = ptr.base.x + ptr.dx;
    lb.zoom.y = ptr.base.y + ptr.dy;
    lb.zoom.img.style.transition = "none";
    lb.zoom.img.style.transform = `translate(${lb.zoom.x}px, ${lb.zoom.y}px) scale(${lb.zoom.scale})`;
  } else if (ptr.dy > 0 && Math.abs(ptr.dy) > Math.abs(ptr.dx) * 1.2 && ptr.slide) {
    // Swipe down to dismiss.
    const img = $("img", ptr.slide);
    img.style.transition = "none";
    img.style.transform = `translateY(${ptr.dy}px) scale(${1 - Math.min(ptr.dy, 400) / 2000})`;
    lbEl.style.background = `rgba(0,0,0,${1 - Math.min(ptr.dy, 300) / 400})`;
  }
});
const endPtr = (e) => {
  if (!ptr) return;
  const { dx, dy, slide } = ptr;
  const moved = Math.hypot(dx, dy) > 8;
  if (lb.zoom) lb.zoom.img.style.transition = "";
  if (!lb.zoom && slide) {
    const img = $("img", slide);
    img.style.transition = "";
    lbEl.style.background = "";
    if (dy > 110 && dy > Math.abs(dx)) { ptr = null; img.style.transform = ""; return lbClose(); }
    img.style.transform = "";
  }
  if (!moved && e.type === "pointerup") {
    const now = Date.now();
    if (now - lastTap < 300) {
      clearTimeout(tapTimer);
      lastTap = 0;
      const img = slide && $("img", slide);
      if (lb.zoom) unzoom();
      else if (img && e.target === img) zoomAt(img, e.clientX, e.clientY);
    } else {
      lastTap = now;
      tapTimer = setTimeout(() => lbEl.classList.toggle("chrome-off"), 300);
    }
  }
  ptr = null;
};
track.addEventListener("pointerup", endPtr);
track.addEventListener("pointercancel", endPtr);

$("#lbClose").addEventListener("click", lbClose);
$("#lbPrev").addEventListener("click", () => lbGo(-1));
$("#lbNext").addEventListener("click", () => lbGo(1));
$("#lbDl").addEventListener("click", () => {
  const m = $("#lbMenu");
  m.classList.toggle("open");
  $("#lbDl").setAttribute("aria-expanded", String(m.classList.contains("open")));
});
$("#lbMenu").addEventListener("click", () => $("#lbMenu").classList.remove("open"));
$("#lbPick").addEventListener("click", () => {
  const p = order[lb.i];
  togglePick(p.id);
  $("#lbPick").setAttribute("aria-pressed", String(picked.has(p.id)));
});
addEventListener("keydown", (e) => {
  if (!lb.open) return;
  if (e.key === "Escape") lb.zoom ? unzoom() : lbClose();
  else if (e.key === "ArrowRight") lbGo(1);
  else if (e.key === "ArrowLeft") lbGo(-1);
});

/* ---------------- Selection and downloads ---------------- */

const picked = new Set();
let size = "4k";
let allMode = false;

function setSelecting(on) {
  document.body.classList.toggle("selecting", on);
  $("#selectBtn").setAttribute("aria-pressed", String(on));
  $("#selectBtn").textContent = on ? "Done" : "Select";
  updateTray();
}

function togglePick(id) {
  picked.has(id) ? picked.delete(id) : picked.add(id);
  for (const t of document.querySelectorAll(`.tile[data-id="${id}"]`)) t.classList.toggle("picked", picked.has(id));
  if (picked.size && !document.body.classList.contains("selecting") && !lb.open) setSelecting(true);
  updateTray();
}

function targets() { return allMode ? order : order.filter((p) => picked.has(p.id)); }

function updateTray() {
  const list = targets();
  const open = allMode || document.body.classList.contains("selecting");
  document.body.classList.toggle("tray-open", open && !lb.open);
  const mb = list.length * AVG_MB[size][tone];
  const est = mb > 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`;
  const label = allMode ? `All ${list.length} photos` : list.length ? `${list.length} selected` : "Tap photos to select";
  $("#trayCount").innerHTML = `${label}<small>${list.length ? `${TONE_FILE[tone].replace(/-/g, " ")} · about ${est}` : "Then download them together"}</small>`;
  $("#trayGo").disabled = !list.length;
  $("#trayGo").textContent = shareReady ? "Save to Photos" : "Download";
}

for (const b of document.querySelectorAll("#sizeSeg button")) {
  b.addEventListener("click", () => {
    size = b.dataset.size;
    for (const x of document.querySelectorAll("#sizeSeg button")) x.setAttribute("aria-checked", String(x === b));
    shareReady = null;
    updateTray();
  });
}

const status = (msg) => ($("#trayStatus").textContent = msg);
const progress = (f) => { $("#trayBar").classList.toggle("on", f !== null); $("#trayBar i").style.width = `${(f || 0) * 100}%`; };
const fileName = (p) => `MollyxPaolo-${String(p.n).padStart(3, "0")}-${TONE_FILE[tone]}-${size === "4k" ? "4K" : "full"}.jpg`;

// Phones: fetch the files, then hand them to the share sheet ("Save N Images" on iOS).
// Two taps because the share sheet needs a fresh tap, and the fetch would use that tap up.
let shareReady = null;
async function prepareShare(list) {
  const files = [];
  for (const [i, p] of list.entries()) {
    status(`Preparing ${i + 1} of ${list.length}…`);
    progress(i / list.length);
    const r = await fetch(url(p, tone, size), { mode: "cors" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    files.push(new File([await r.blob()], fileName(p), { type: "image/jpeg" }));
  }
  progress(null);
  if (!navigator.canShare || !navigator.canShare({ files })) return false;
  shareReady = files;
  status(`Ready. Tap "Save to Photos".`);
  updateTray();
  return true;
}

async function zipDownload(list) {
  // Ask where to save first: the picker needs the original click, before any await.
  let writable = null;
  const zipName = `MollyxPaolo-${TONE_FILE[tone]}-${size === "4k" ? "4K" : "full"}-${list.length}.zip`;
  if ("showSaveFilePicker" in window) {
    try {
      const h = await showSaveFilePicker({ suggestedName: zipName, types: [{ description: "Zip", accept: { "application/zip": [".zip"] } }] });
      writable = await h.createWritable();
    } catch (e) { if (e.name === "AbortError") return; }
  }
  const { downloadZip } = await import("https://cdn.jsdelivr.net/npm/client-zip@2.5.1/index.js");
  let done = 0;
  async function* files() {
    for (const p of list) {
      status(`Adding ${done + 1} of ${list.length}…`);
      const r = await fetch(url(p, tone, size), { mode: "cors" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      yield { name: fileName(p), input: r };
      progress(++done / list.length);
    }
  }
  const zip = downloadZip(files());
  if (writable) {
    // Streams straight to disk: memory stays flat even for the full-size set.
    await zip.body.pipeTo(writable);
  } else {
    const blob = await zip.blob(); // Safari/Firefox: held in memory, so large sets are slow
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: zipName });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 60_000);
  }
  progress(null);
  status(`Saved ${zipName}`);
}

$("#trayGo").addEventListener("click", async () => {
  const list = targets();
  if (!list.length) return;
  const go = $("#trayGo");
  try {
    if (shareReady) {
      await navigator.share({ files: shareReady });
      shareReady = null;
      status("");
      return updateTray();
    }
    go.disabled = true;
    if (coarse && navigator.canShare && list.length <= 40) {
      if (await prepareShare(list)) return;
    }
    await zipDownload(list);
  } catch (e) {
    progress(null);
    if (e.name === "AbortError") return status("");
    status(e instanceof TypeError
      ? "The photos couldn't be fetched. (Prototype: the bucket needs a CORS rule for this site.)"
      : `Something went wrong: ${e.message}`);
  } finally {
    go.disabled = false;
    updateTray();
  }
});

$("#trayClear").addEventListener("click", () => {
  picked.clear();
  for (const t of document.querySelectorAll(".tile.picked")) t.classList.remove("picked");
  allMode = false;
  shareReady = null;
  status("");
  setSelecting(false);
});
$("#selectBtn").addEventListener("click", () => {
  allMode = false;
  setSelecting(!document.body.classList.contains("selecting"));
});
const openAll = () => { allMode = true; shareReady = null; status(""); updateTray(); };
$("#allBtn").addEventListener("click", openAll);
$("#allBtn2").addEventListener("click", openAll);

/* ---------------- Wiring ---------------- */

document.addEventListener("click", (e) => {
  const t = e.target.closest(".tile");
  if (!t) return;
  if (document.body.classList.contains("selecting")) togglePick(t.dataset.id);
  else lbOpen(t.dataset.id);
});

for (const b of document.querySelectorAll(".tone button")) b.addEventListener("click", () => setTone(b.dataset.tone));
for (const b of document.querySelectorAll(".tone button")) b.setAttribute("aria-checked", String(b.dataset.tone === tone));

new IntersectionObserver(([e]) => $("#head").classList.toggle("solid", !e.isIntersecting), { rootMargin: "-64px 0px 0px 0px" })
  .observe($("#hero"));

const video = $("#video");
video.poster = D.video.poster;
video.src = D.video.src;
$("#videoDl").href = D.video.src;

mqMobile.addEventListener("change", () => {
  for (const c of D.chapters) {
    const sec = document.getElementById(`ch-${c.id}`);
    if (sec) renderRows($(".rows", sec), photos.filter((p) => p.chapter === c.id));
  }
});

gate();
render();
hero();
updateTray();
