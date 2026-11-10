// Barrierefreiheit, Basisprüfung im Browser (ersetzt keinen vollständigen WCAG-Test mit Screenreader).
// Liefert JSON: Bedienelemente ohne zugänglichen Namen, Bilder ohne alt, Felder ohne Beschriftung,
// fehlendes lang-Attribut, zu kleine Tippflächen (< 24 px, WCAG 2.2 SC 2.5.8).
(() => {
  const name = (el) => (el.getAttribute("aria-label") || el.getAttribute("title") || (el.getAttribute("aria-labelledby") || "").split(" ").map((id) => (document.getElementById(id) || {}).textContent || "").join(" ") || el.textContent || el.value || (el.querySelector("img[alt],svg title") || {}).alt || "").trim();
  const sichtbar = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
  const was = (el) => el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "");
  const out = { ohneName: [], bildOhneAlt: [], feldOhneLabel: [], kleineZiele: [], lang: document.documentElement.lang || "" };
  document.querySelectorAll("button, a[href], [role=button], [role=tab], [role=switch]").forEach((el) => {
    if (!sichtbar(el)) return;
    if (!name(el)) out.ohneName.push(was(el));
    const r = el.getBoundingClientRect();
    if ((r.width < 24 || r.height < 24) && !el.closest("p, li > a")) out.kleineZiele.push(was(el) + " " + Math.round(r.width) + "x" + Math.round(r.height));
  });
  document.querySelectorAll("img").forEach((el) => { if (sichtbar(el) && !el.hasAttribute("alt")) out.bildOhneAlt.push(el.src.split("/").pop()); });
  document.querySelectorAll("input:not([type=hidden]), select, textarea").forEach((el) => {
    if (!sichtbar(el)) return;
    const lab = el.id && document.querySelector('label[for="' + el.id + '"]');
    if (!lab && !el.closest("label") && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby") && !el.getAttribute("title")) out.feldOhneLabel.push(was(el) + (el.placeholder ? ' placeholder="' + el.placeholder.slice(0, 30) + '"' : ""));
  });
  for (const k of ["ohneName", "bildOhneAlt", "feldOhneLabel", "kleineZiele"]) out[k] = [...new Set(out[k])].slice(0, 25);
  return JSON.stringify(out);
})()
