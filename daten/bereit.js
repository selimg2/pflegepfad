/* Stellt die Inhalte so bereit, wie die App sie erwartet (Element #data mit JSON). */
(function () {
  var el = document.createElement("script");
  el.type = "application/json";
  el.id = "data";
  el.textContent = JSON.stringify(window.FP_DATA);
  document.body.appendChild(el);
})();
