(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var Cars = window.CarModels;

  /* ---------- نوار پیشرفت زیر کارت‌ها ---------- */
  function toneFor(daysLeft, fraction) { return daysLeft !== null && daysLeft < 0 ? "bad" : daysLeft !== null && daysLeft <= 7 ? "bad" : daysLeft !== null && daysLeft <= 30 ? "warn" : fraction < 0.12 ? "warn" : "ok"; }
  function bar(fraction, tone) {
    var p = Math.round(Math.max(0, Math.min(1, fraction)) * 100);
    return '<div class="deadline-progress" data-tone="' + tone + '" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + p + '"><i style="width:' + p + '%"></i></div>';
  }
  function spanDays(a, b) { var x = parseIso(a), y = parseIso(b); return x && y ? Math.max(1, Math.round((y - x) / 864e5)) : 365; }
  window.docBar = function (d) {
    try {
      var start = d.kind === "insurance" ? (d.startDate || d.paymentDate) : d.inspectionDate, left = daysUntil(d.expiryDate);
      if (left === null) return "";
      var total = start ? spanDays(start, d.expiryDate) : 365, fraction = left < 0 ? 0 : Math.min(1, left / total);
      return bar(fraction, toneFor(left, fraction));
    } catch (error) { return ""; }
  };
  window.entryBar = function (entry) {
    try {
      var due = dueInfo(entry);
      if (!due) return "";
      var fractions = [];
      if (due.daysLeft !== null) fractions.push(due.daysLeft < 0 ? 0 : due.daysLeft / spanDays(entry.date, entry.nextDate));
      if (due.kmLeft !== null && entry.nextKm !== null) fractions.push(due.kmLeft < 0 ? 0 : due.kmLeft / Math.max(1, entry.nextKm - entry.km));
      var fraction = Math.min.apply(null, fractions);
      return bar(fraction, due.overdue || due.today ? "bad" : due.soon ? "warn" : "ok");
    } catch (error) { return ""; }
  };

  /* ---------- صحنهٔ سه‌بعدی خودرو ---------- */
  var canvas = $("#car-canvas"), ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
  if (!Cars || !ctx) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var AUTO = reduce ? 0 : 0.5, yaw = 0.6, vel = AUTO, dragging = false, lastX = 0, lastT = 0, raf = 0, visible = true, model = null, signature = "", cw = 460, ch = 264, last = 0;

  function resize() {
    var rect = canvas.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    cw = Math.max(240, Math.round(rect.width || 460)); ch = Math.round(cw * 0.575);
    canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function paint() { if (model) Cars.draw(ctx, model, cw, ch, yaw, 0.24, {}); }
  function frame(t) {
    raf = 0;
    if (!model || !visible || document.hidden) return;
    var dt = Math.min(60, last ? t - last : 16); last = t;
    if (!dragging) { yaw += vel * dt / 1000; vel += (AUTO - vel) * Math.min(1, dt / 500); }
    paint();
    if (AUTO || dragging || Math.abs(vel) > 0.01) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } }

  function current() {
    var v = (typeof state !== "undefined" && state.vehicle) || {};
    var entry = Cars.byKey(v.carKey) || Cars.find(v.model) || Cars.find(v.label) || Cars.generic((v.model || "") + " " + (v.label || ""));
    return { entry: entry, color: /^#[0-9a-f]{3,8}$/i.test(v.color || "") ? v.color : "#f2f2f2", label: v.label || "" };
  }
  function sync() {
    var c = current(), sig = c.entry.key + "|" + c.color;
    if (sig !== signature) { signature = sig; model = Cars.make(c.entry, c.color); }
    var cap = $("#car-caption");
    if (cap) cap.textContent = c.entry.key.indexOf("generic-") === 0 ? "" : c.entry.fa;
    resize(); paint(); kick();
  }

  var pointers = {};
  canvas.addEventListener("pointerdown", function (e) {
    dragging = true; lastX = e.clientX; lastT = performance.now(); vel = 0;
    try { canvas.setPointerCapture(e.pointerId); } catch (x) { }
    kick();
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var now = performance.now(), dx = e.clientX - lastX, dt = Math.max(8, now - lastT);
    yaw += dx * 0.012; vel = Math.max(-5, Math.min(5, dx * 0.012 / (dt / 1000))); lastX = e.clientX; lastT = now;
    paint();
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (type) { canvas.addEventListener(type, function () { dragging = false; kick(); }); });
  window.addEventListener("resize", function () { resize(); paint(); });
  document.addEventListener("visibilitychange", kick);
  if (window.IntersectionObserver) new IntersectionObserver(function (items) { visible = items[0].isIntersecting; if (visible) { resize(); paint(); } kick(); }).observe(canvas);

  var priorRender = window.render;
  if (typeof priorRender === "function") window.render = function () { var result = priorRender.apply(this, arguments); sync(); return result; };

  /* ---------- فرم مشخصات خودرو: نام خودرو و رنگ ---------- */
  var selected = "";
  function buildVehicleExtras() {
    var model = $("#vehicle-model"), grid = $("#vehicle-form .form-grid");
    if (!model || !grid || $("#car-color-field")) return;
    var list = document.createElement("datalist");
    list.id = "car-catalog";
    list.innerHTML = Cars.list.map(function (c) { return '<option value="' + c.fa.replace(/"/g, "") + '"></option>'; }).join("");
    document.body.appendChild(list);
    model.setAttribute("list", "car-catalog");
    var hint = document.createElement("small");
    hint.id = "car-match-hint"; hint.className = "car-match-hint";
    model.parentNode.appendChild(hint);
    model.addEventListener("input", function () { updateHint(); });
    var field = document.createElement("div");
    field.className = "field field-wide car-color-field"; field.id = "car-color-field";
    field.innerHTML = '<span>رنگ خودرو</span><div class="car-swatches" role="radiogroup" aria-label="رنگ خودرو">' + Cars.colors.map(function (c) { return '<button type="button" class="car-swatch" role="radio" aria-checked="false" data-color="' + c + '" style="--sw:' + c + '" aria-label="' + c + '"></button>'; }).join("") + '</div>';
    var holder = model.closest("label") || model;
    holder.parentNode.insertBefore(field, holder.nextSibling);
    field.addEventListener("click", function (e) { var b = e.target.closest(".car-swatch"); if (b) pick(b.dataset.color); });
  }
  function pick(color) {
    selected = color || "";
    document.querySelectorAll(".car-swatch").forEach(function (b) { b.setAttribute("aria-checked", b.dataset.color === selected ? "true" : "false"); });
  }
  function updateHint() {
    var hint = $("#car-match-hint"), field = $("#vehicle-model"), label = $("#vehicle-label");
    if (!hint || !field) return;
    var text = field.value || (label && label.value) || "", m = text.trim() ? Cars.find(text) : null;
    hint.textContent = m ? "تصویر خودرو: " + m.fa : (text.trim() ? "این خودرو در فهرست نیست؛ مدل عمومی نمایش داده می‌شود." : "با نوشتن نام خودرو، تصویر آن در صفحهٔ اصلی نشان داده می‌شود.");
  }
  buildVehicleExtras();
  var originalOpen = window.openVehicleDialog;
  if (typeof originalOpen === "function") {
    window.openVehicleDialog = function () {
      var r = originalOpen.apply(this, arguments);
      buildVehicleExtras();
      pick((typeof state !== "undefined" && state.vehicle && state.vehicle.color) || "");
      updateHint();
      return r;
    };
  }
  var originalSubmit = window.handleVehicleSubmit;
  if (typeof originalSubmit === "function") {
    window.handleVehicleSubmit = function () {
      var chosen = selected, result = originalSubmit.apply(this, arguments), dialog = $("#vehicle-dialog");
      if (dialog && !dialog.open && state.vehicle) { state.vehicle.color = chosen || ""; saveState(); sync(); }
      return result;
    };
  }
  sync();
})();
