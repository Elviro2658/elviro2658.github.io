(function () {
  "use strict";
  var select = document.getElementById("service-type");
  if (!select || select.dataset.pickerReady) return;
  select.dataset.pickerReady = "1";

  var wrap = document.createElement("div");
  wrap.className = "type-picker";
  var current = document.createElement("button");
  current.type = "button";
  current.className = "type-picker-current";
  current.setAttribute("aria-haspopup", "listbox");
  current.setAttribute("aria-expanded", "false");
  var label = document.createElement("span");
  label.className = "type-picker-label";
  var arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "▾";
  current.appendChild(label);
  current.appendChild(arrow);
  var panel = document.createElement("div");
  panel.className = "type-picker-panel";
  panel.hidden = true;
  panel.setAttribute("role", "listbox");
  wrap.appendChild(current);
  wrap.appendChild(panel);
  select.style.cssText = "position:absolute;opacity:0;pointer-events:none;width:1px;height:1px";
  select.tabIndex = -1;
  select.setAttribute("aria-hidden", "true");
  select.parentNode.appendChild(wrap);

  function selectedText() {
    var option = select.options[select.selectedIndex];
    return option ? option.textContent : "انتخاب نوع سرویس";
  }
  function refresh() {
    label.textContent = selectedText();
    Array.prototype.forEach.call(panel.querySelectorAll(".type-item"), function (item) {
      item.setAttribute("aria-selected", item.dataset.value === select.value ? "true" : "false");
    });
  }
  function closePanel() {
    panel.hidden = true;
    current.setAttribute("aria-expanded", "false");
  }
  function addGroup(title, options) {
    var head = document.createElement("button");
    head.type = "button";
    head.className = "type-group-head";
    head.setAttribute("aria-expanded", "false");
    var text = document.createElement("span");
    text.textContent = title;
    var mark = document.createElement("span");
    mark.className = "type-group-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "▸";
    head.appendChild(text);
    head.appendChild(mark);
    var items = document.createElement("div");
    items.className = "type-group-items";
    items.hidden = true;
    options.forEach(function (option) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "type-item";
      item.setAttribute("role", "option");
      item.dataset.value = option.value;
      item.textContent = option.textContent;
      items.appendChild(item);
    });
    panel.appendChild(head);
    panel.appendChild(items);
  }
  function build() {
    panel.innerHTML = "";
    var loose = [];
    Array.prototype.forEach.call(select.children, function (node) {
      if (node.tagName === "OPTGROUP") addGroup(node.label, Array.prototype.slice.call(node.children));
      else if (node.tagName === "OPTION") loose.push(node);
    });
    if (loose.length) addGroup("سایر موارد ثبت‌شده", loose);
    refresh();
  }

  current.addEventListener("click", function () {
    if (panel.hidden) {
      build();
      panel.hidden = false;
      current.setAttribute("aria-expanded", "true");
    } else closePanel();
  });
  panel.addEventListener("click", function (event) {
    var head = event.target.closest(".type-group-head");
    if (head) {
      var items = head.nextElementSibling;
      var open = items.hidden;
      items.hidden = !open;
      head.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    var item = event.target.closest(".type-item");
    if (!item) return;
    select.value = item.dataset.value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    refresh();
    closePanel();
  });
  document.addEventListener("click", function (event) {
    if (!panel.hidden && !wrap.contains(event.target)) closePanel();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !panel.hidden) closePanel();
  });

  var original = window.openServiceDialog;
  if (typeof original === "function") {
    window.openServiceDialog = function () {
      var result = original.apply(this, arguments);
      closePanel();
      refresh();
      return result;
    };
  }
  refresh();
})();
