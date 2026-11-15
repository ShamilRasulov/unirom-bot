(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Возрастной фильтр ---------- */
  const gate = $("#ageGate");
  let confirmed = false;
  try { confirmed = sessionStorage.getItem("age21") === "1"; } catch (e) {}
  if (confirmed) gate.remove(); else document.body.classList.add("locked");
  $("#ageYes")?.addEventListener("click", () => {
    try { sessionStorage.setItem("age21", "1"); } catch (e) {}
    document.body.classList.remove("locked");
    gate.remove();
  });
  $("#ageNo")?.addEventListener("click", () => { $("#ageDenied").hidden = false; });

  /* ---------- Мобильное меню ---------- */
  const burger = $("#burger"), nav = $("#nav");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); }
  });

  /* ---------- Модалка функции ---------- */
  const modal = $("#modal");
  function openFeature(key) {
    const f = FEATURES[key];
    if (!f) return;
    $("#modalIcon").textContent = f.icon;
    $("#modalTitle").textContent = f.title;
    $("#modalBody").innerHTML = "<ul>" + f.body.map((b) => `<li>${esc(b)}</li>`).join("") + "</ul>";
    modal.hidden = false;
    $(".modal-close", modal).focus();
  }
  modal.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) modal.hidden = true; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") modal.hidden = true; });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-feature]");
    if (b) openFeature(b.dataset.feature);
  });

  /* ---------- Устройства ---------- */
  const tabs = $("#deviceTabs"), panel = $("#devicePanel");
  tabs.innerHTML = DEVICES.map((d, i) =>
    `<button role="tab" class="tab${i === 1 ? " active" : ""}" data-id="${d.id}" aria-selected="${i === 1}">${esc(d.name)}</button>`
  ).join("");
  function renderDevice(id) {
    const d = DEVICES.find((x) => x.id === id);
    panel.innerHTML = `
      <div class="device-visual" style="background:${d.color}">
        <span class="badge">${esc(d.tag)}</span>
        <div class="mini-device ${d.id === "one" ? "is-one" : ""}"><span></span></div>
      </div>
      <div class="device-info">
        <h3>${esc(d.name)}</h3>
        <p>${esc(d.lead)}</p>
        <ul class="checks">${d.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        <p class="muted">Чтобы узнать больше о каждой функции, нажмите на кнопки ниже ⬇️</p>
        <div class="feature-buttons">
          ${d.features.map((k) => `<button class="btn btn-soft" data-feature="${k}">${esc(FEATURES[k].title)}</button>`).join("")}
        </div>
        ${d.id !== "one" ? '<p class="footnote">*Только в режиме «Производительность» при отключённой функции Паузы.</p>' : ""}
      </div>`;
  }
  tabs.addEventListener("click", (e) => {
    const t = e.target.closest(".tab");
    if (!t) return;
    tabs.querySelectorAll(".tab").forEach((x) => { x.classList.toggle("active", x === t); x.setAttribute("aria-selected", x === t); });
    renderDevice(t.dataset.id);
  });
  renderDevice(DEVICES[1].id);

  /* ---------- Функции ---------- */
  $("#featureGrid").innerHTML = Object.entries(FEATURES).map(([k, f]) => `
    <button class="feature-card" data-feature="${k}">
      <span class="feature-icon">${f.icon}</span>
      <b>${esc(f.title)}</b>
      <span>${esc(f.short)}</span>
      <span class="more">Подробнее →</span>
    </button>`).join("");

  /* ---------- TEREA ---------- */
  const grid = $("#tereaGrid");
  function renderTerea(filter) {
    grid.innerHTML = TEREA.filter((t) => filter === "all" || t.tags.includes(filter)).map((t) => `
      <article class="terea-card">
        <div class="terea-top" style="--c:${t.color}">
          <span class="terea-name">${esc(t.name.toUpperCase())}</span>
          ${t.tags.includes("pearl") ? '<span class="pill">капсула</span>' : ""}
        </div>
        <div class="terea-body">
          <h3>TEREA ${esc(t.name)}</h3>
          <p>${esc(t.desc)}</p>
          ${t.verify ? '<p class="verify">Профиль вкуса может отличаться по рынкам — уточняйте в магазине.</p>' : ""}
          <a href="#stores" class="link">Найти магазин 📍</a>
        </div>
      </article>`).join("");
  }
  $("#tereaFilters").addEventListener("click", (e) => {
    const c = e.target.closest(".chip");
    if (!c) return;
    document.querySelectorAll("#tereaFilters .chip").forEach((x) => x.classList.toggle("active", x === c));
    renderTerea(c.dataset.filter);
  });
  renderTerea("all");

  /* ---------- Аксессуары ---------- */
  $("#accGrid").innerHTML = ACCESSORIES.map((a) => `
    <article class="acc-card">
      <div class="acc-top" style="background:${a.color}"><span>${esc(a.device)}</span></div>
      <ul>${a.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    </article>`).join("");

  /* ---------- Сравнение ---------- */
  $("#compareBody").innerHTML = COMPARE.map((r) =>
    `<tr><th scope="row">${esc(r[0])}</th>${r.slice(1).map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`
  ).join("");

  /* ---------- FAQ ---------- */
  $("#faqList").innerHTML = FAQ.map(([q, a]) =>
    `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`
  ).join("");
})();
