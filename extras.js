(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function digits(v) { return String(toLatinDigits(String(v == null ? "" : v))).replace(/[٬,\s]/g, ""); }
  function num(v) { var n = Number(digits(v).replace(/٫/g, ".").replace(/[^\d.]/g, "")); return isFinite(n) ? n : 0; }
  function fa(n) { return toPersianDigits(String(n)); }

  /* ---- یادآوری طبق تاریخ: با وارد شدن تاریخ تیک می‌خورد و با پاک شدن آن برمی‌دارد ---- */
  function syncDateReminder() {
    var field = $("#next-date"), box = $("#service-reminder-enabled");
    if (field && box) box.checked = !!digits(field.value);
  }
  ["input", "change"].forEach(function (type) {
    document.addEventListener(type, function (event) {
      if (event.target && event.target.id === "next-date") syncDateReminder();
    }, true);
  });
  var openService = window.openServiceDialog;
  if (typeof openService === "function") {
    window.openServiceDialog = function () {
      var result = openService.apply(this, arguments);
      if (!arguments[0]) { var box = $("#service-reminder-enabled"); if (box) box.checked = false; }
      return result;
    };
  }

  /* ---- انتهای هر صفحه: دو دکمهٔ دایره‌ای ---- */
  var UP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>';
  function addEndActions() {
    document.querySelectorAll(".view-panel").forEach(function (panel) {
      if (panel.querySelector(".page-end-actions")) return;
      var box = document.createElement("div");
      box.className = "page-end-actions";
      box.innerHTML = '<button type="button" class="circle-button circle-up" data-scroll="tabs" aria-label="رفتن به ابتدای این بخش">' + UP + '</button>' +
        '<button type="button" class="circle-button circle-app" data-scroll="home" aria-label="بازگشت به نمای کلی"><img src="/icons/service-negar-app.svg" alt="" width="32" height="32"></button>';
      panel.appendChild(box);
    });
  }
  document.addEventListener("click", function (event) {
    var button = event.target.closest && event.target.closest("[data-scroll]");
    if (!button) return;
    if (button.dataset.scroll === "tabs") {
      var tabs = $(".tabs");
      if (tabs) tabs.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      var home = $("#brand-home-link");
      if (home) home.click();
      else { var dash = $('.tab-button[data-view="dashboard"]'); if (dash) dash.click(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    }
  });

  /* ---- فیلتر تاریخ هزینه‌ها: پیش‌فرض بسته ---- */
  document.addEventListener("click", function (event) {
    var toggle = event.target.closest && event.target.closest("#expense-filter-toggle");
    if (!toggle) return;
    var body = $("#expense-filter-body"), open = body.hidden;
    body.hidden = !open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.classList.toggle("is-open", open);
  });

  /* ---- پمپ بنزین ---- */
  var TYPES = {
    petrol: { name: "بنزین", unit: "لیتر", qty: "مقدار بنزین (لیتر)", price: "قیمت هر لیتر (تومان)" },
    cng: { name: "سی‌ان‌جی", unit: "متر مکعب", qty: "مقدار سی‌ان‌جی (متر مکعب)", price: "قیمت هر متر مکعب (تومان)" }
  };
  var fuelType = "petrol", editingId = null, totalManual = false, deleteArmed = null;
  var drafts = { petrol: { qty: "", price: "", total: "" }, cng: { qty: "", price: "", total: "" } };
  var dialog;

  function fuelList() { if (!Array.isArray(state.fuel)) state.fuel = []; return state.fuel; }

  function buildDialog() {
    dialog = document.createElement("dialog");
    dialog.id = "fuel-dialog";
    dialog.className = "app-dialog fuel-dialog";
    dialog.setAttribute("aria-labelledby", "fuel-dialog-title");
    dialog.innerHTML =
      '<div class="dialog-head"><div><span class="section-kicker">پمپ بنزین</span><h2 id="fuel-dialog-title">ثبت سوخت‌گیری</h2></div><button class="close-button" type="button" data-fuel="close" aria-label="بستن">×</button></div>' +
      '<div class="fuel-body">' +
      '<div class="fuel-switch" role="tablist" aria-label="نوع سوخت"><button type="button" role="tab" data-fuel-type="petrol" aria-selected="true">بنزین</button><button type="button" role="tab" data-fuel-type="cng" aria-selected="false">سی‌ان‌جی</button></div>' +
      '<div class="dispenser">' +
      '<div class="dispenser-row"><span class="dispenser-label" id="fuel-qty-label"></span><div class="dispenser-controls"><button class="fuel-step" type="button" data-fuel-step="fuel-qty" data-step="1" aria-label="یک واحد بیشتر">+۱</button><input id="fuel-qty" type="text" inputmode="decimal" autocomplete="off" aria-labelledby="fuel-qty-label" placeholder="۰" /><button class="fuel-step" type="button" data-fuel-step="fuel-qty" data-step="-1" aria-label="یک واحد کمتر">−۱</button></div></div>' +
      '<div class="dispenser-row"><span class="dispenser-label" id="fuel-price-label"></span><div class="dispenser-controls"><button class="fuel-step" type="button" data-fuel-step="fuel-price" data-step="1000" aria-label="هزار تومان بیشتر">+۱٬۰۰۰</button><input id="fuel-price" type="text" inputmode="numeric" autocomplete="off" aria-labelledby="fuel-price-label" placeholder="۰" /><button class="fuel-step" type="button" data-fuel-step="fuel-price" data-step="-1000" aria-label="هزار تومان کمتر">−۱٬۰۰۰</button></div></div>' +
      '<div class="dispenser-row dispenser-total"><span class="dispenser-label" id="fuel-total-label">مجموع هزینه (تومان)</span><div class="dispenser-controls"><input id="fuel-total" type="text" inputmode="numeric" autocomplete="off" aria-labelledby="fuel-total-label" placeholder="۰" /></div></div>' +
      '</div>' +
      '<label class="field fuel-date-field"><span>تاریخ سوخت‌گیری</span><div class="date-input-row"><input id="fuel-date" inputmode="numeric" autocomplete="off" /><button class="date-picker-button" type="button" data-calendar="fuel-date" aria-label="انتخاب تاریخ از تقویم">▦</button></div></label>' +
      '<p id="fuel-error" class="form-error" role="alert" aria-live="polite"></p>' +
      '<div class="fuel-actions"><button class="button button-primary" type="button" data-fuel="save">ذخیره</button><button class="button button-outline" type="button" data-fuel="delete" hidden>حذف</button><button class="button button-outline" type="button" data-fuel="close">انصراف</button></div>' +
      '<div class="fuel-recent" id="fuel-recent"></div></div>';
    document.body.appendChild(dialog);
  }

  function fmt(n) { return n > 0 ? formatNumber(n) : ""; }
  function readDraft() { var d = drafts[fuelType]; d.qty = $("#fuel-qty").value; d.price = $("#fuel-price").value; d.total = $("#fuel-total").value; d.manual = totalManual; }
  function writeDraft() {
    var d = drafts[fuelType], t = TYPES[fuelType];
    $("#fuel-qty").value = d.qty; $("#fuel-price").value = d.price; $("#fuel-total").value = d.total; totalManual = !!d.manual;
    $("#fuel-qty-label").textContent = t.qty; $("#fuel-price-label").textContent = t.price;
    dialog.querySelectorAll("[data-fuel-type]").forEach(function (b) { b.setAttribute("aria-selected", b.dataset.fuelType === fuelType ? "true" : "false"); });
  }
  function recalcTotal() {
    if (totalManual) return;
    var q = num($("#fuel-qty").value), p = num($("#fuel-price").value);
    $("#fuel-total").value = q > 0 && p > 0 ? formatNumber(Math.round(q * p)) : "";
  }
  function stepField(id, step) {
    var el = $("#" + id), v = num(el.value) + step;
    if (v < 0) v = 0;
    el.value = id === "fuel-qty" ? (v > 0 ? fa(Math.round(v * 100) / 100) : "") : fmt(v);
    recalcTotal();
  }
  /* نگه‌داشتن دکمه: سرعت به‌تدریج بالا می‌رود؛ تپ کوتاه فقط یک واحد */
  var holdTimer = null, holdTicks = 0, heldButton = null, suppressClick = false;
  function stopHold() { clearTimeout(holdTimer); holdTimer = null; heldButton = null; }
  function holdTick() {
    if (!heldButton) return;
    stepField(heldButton.dataset.fuelStep, Number(heldButton.dataset.step));
    holdTicks += 1;
    var delay = holdTicks < 6 ? 140 : holdTicks < 18 ? 80 : 40;
    holdTimer = setTimeout(holdTick, delay);
  }
  document.addEventListener("pointerdown", function (event) {
    var button = event.target.closest && event.target.closest("[data-fuel-step]");
    if (!button) return;
    event.preventDefault();
    suppressClick = true;
    stopHold();
    heldButton = button; holdTicks = 0;
    stepField(button.dataset.fuelStep, Number(button.dataset.step));
    holdTimer = setTimeout(holdTick, 380);
  });
  ["pointerup", "pointercancel", "pointerleave", "contextmenu"].forEach(function (type) { document.addEventListener(type, stopHold, true); });
  document.addEventListener("click", function (event) {
    var button = event.target.closest && event.target.closest("[data-fuel-step]");
    if (!button) return;
    if (suppressClick) { suppressClick = false; return; }
    stepField(button.dataset.fuelStep, Number(button.dataset.step)); // کیبورد
  });

  function render() {
    var list = fuelList().slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)) || String(b.createdAt || "").localeCompare(String(a.createdAt || "")); }).slice(0, 6);
    $("#fuel-recent").innerHTML = list.length ? '<h3>آخرین ثبت‌ها</h3>' + list.map(function (f) { return window.renderFuelExpense(f); }).join("") : "";
  }
  function openFuel(id) {
    if (!dialog) buildDialog();
    editingId = id || null; deleteArmed = null; totalManual = false;
    drafts = { petrol: { qty: "", price: "", total: "" }, cng: { qty: "", price: "", total: "" } };
    var rec = id ? fuelList().filter(function (f) { return f.id === id; })[0] : null;
    fuelType = rec ? rec.fuel : "petrol";
    if (rec) { drafts[fuelType] = { qty: rec.liters ? fa(rec.liters) : "", price: fmt(rec.price), total: fmt(rec.cost), manual: !(rec.liters > 0 && rec.price > 0 && Math.round(rec.liters * rec.price) === rec.cost) }; }
    writeDraft();
    $("#fuel-date").value = formatJalaliInput(rec ? rec.date : todayIso());
    $("#fuel-error").textContent = "";
    var del = dialog.querySelector('[data-fuel="delete"]'); del.hidden = !rec; del.textContent = "حذف";
    dialog.querySelector("#fuel-dialog-title").textContent = rec ? "ویرایش سوخت‌گیری" : "ثبت سوخت‌گیری";
    render();
    openDialog(dialog);
  }
  window.openFuelDialog = openFuel;

  function saveFuel() {
    readDraft();
    var q = num($("#fuel-qty").value), p = num($("#fuel-price").value), total = num($("#fuel-total").value), err = $("#fuel-error");
    if (!totalManual && q > 0 && p > 0) total = Math.round(q * p);
    var iso = parseJalali($("#fuel-date").value.trim());
    if (!iso) { err.textContent = "تاریخ معتبر نیست؛ از تقویم انتخاب کنید."; return; }
    if (!(total > 0)) { err.textContent = "مجموع هزینه را وارد کنید یا مقدار و قیمت هر واحد را کامل کنید."; return; }
    var list = fuelList(), old = editingId ? list.filter(function (f) { return f.id === editingId; })[0] : null;
    var rec = { id: old ? old.id : makeId("f"), date: iso, fuel: fuelType, liters: Math.round(q * 100) / 100, price: Math.round(p), cost: Math.round(total), createdAt: old ? old.createdAt : new Date().toISOString() };
    if (old) list[list.indexOf(old)] = rec; else list.push(rec);
    if (saveState() !== false) { closeDialog(dialog); render_all(); showToast("سوخت‌گیری ثبت شد."); }
  }
  function render_all() { if (typeof window.render === "function") window.render(); }

  document.addEventListener("click", function (event) {
    var t = event.target;
    if (!t.closest) return;
    if (t.closest("#fuel-card")) { openFuel(); return; }
    var typeButton = t.closest("[data-fuel-type]");
    if (typeButton && dialog && dialog.contains(typeButton)) { readDraft(); fuelType = typeButton.dataset.fuelType; writeDraft(); return; }
    var action = t.closest("[data-fuel]");
    if (action && dialog && dialog.contains(action)) {
      var a = action.dataset.fuel;
      if (a === "close") closeDialog(dialog);
      else if (a === "save") saveFuel();
      else if (a === "delete") {
        if (deleteArmed !== editingId) { deleteArmed = editingId; action.textContent = "تأیید حذف"; setTimeout(function () { if (deleteArmed === editingId) { deleteArmed = null; action.textContent = "حذف"; } }, 3500); return; }
        state.fuel = fuelList().filter(function (f) { return f.id !== editingId; });
        if (saveState() !== false) { closeDialog(dialog); render_all(); showToast("سوخت‌گیری حذف شد."); }
      }
      return;
    }
    var row = t.closest('[data-record-card="fuel"]');
    if (row) { event.preventDefault(); event.stopImmediatePropagation(); if (dialog && dialog.open) closeDialog(dialog); openFuel(row.dataset.id); }
  }, true);
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    var card = event.target.closest && event.target.closest("#fuel-card");
    if (card) { event.preventDefault(); openFuel(); return; }
    var row = event.target.closest && event.target.closest('[data-record-card="fuel"]');
    if (row) { event.preventDefault(); event.stopImmediatePropagation(); openFuel(row.dataset.id); }
  }, true);
  document.addEventListener("input", function (event) {
    var id = event.target && event.target.id;
    if (id === "fuel-qty" || id === "fuel-price") { totalManual = false; recalcTotal(); }
    else if (id === "fuel-total") totalManual = true;
  });
  document.addEventListener("focusout", function (event) {
    var id = event.target && event.target.id;
    if (id === "fuel-price" || id === "fuel-total") { var n = num(event.target.value); event.target.value = fmt(n); }
    else if (id === "fuel-qty") { var q = num(event.target.value); event.target.value = q > 0 ? fa(Math.round(q * 100) / 100) : ""; }
  });

  window.renderFuelExpense = function (f) {
    var t = TYPES[f.fuel] || TYPES.petrol, detail = [formatJalali(f.date)];
    if (f.liters > 0) detail.push(fa(f.liters) + " " + t.unit);
    if (f.price > 0) detail.push(formatNumber(f.price) + " تومان برای هر " + t.unit);
    return '<article class="expense-row fuel-expense" data-record-card="fuel" data-id="' + escapeHtml(f.id) + '" role="button" tabindex="0" aria-label="ویرایش ' + escapeHtml(t.name) + '"><div class="expense-left"><strong>' + escapeHtml(t.name) + '</strong><small>' + escapeHtml(detail.join(" · ")) + '</small></div><span class="expense-amount">' + formatMoney(f.cost) + '</span></article>';
  };

  function renderFuelStat() {
    var cur = jalaliParts(todayIso()), petrol = 0, cng = 0;
    fuelList().forEach(function (f) {
      var p = jalaliParts(f.date);
      if (!p || p.year !== cur.year || p.month !== cur.month) return;
      if (f.fuel === "cng") cng += f.liters; else petrol += f.liters;
    });
    var value = $("#fuel-stat"), sub = $("#fuel-stat-sub");
    if (!value || !sub) return;
    var fix = function (n) { return fa(Math.round(n * 10) / 10); };
    value.textContent = fix(petrol) + " لیتر";
    sub.textContent = cng > 0 ? fix(cng) + " متر مکعب سی‌ان‌جی" : "";
  }
  var priorRender = window.render;
  if (typeof priorRender === "function") {
    window.render = function () { var result = priorRender.apply(this, arguments); renderFuelStat(); return result; };
  }

  addEndActions();
  renderFuelStat();
})();
