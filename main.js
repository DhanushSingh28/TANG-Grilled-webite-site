/* Tang Real Flame Grilled — shared interactive behaviour */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("nav-open", !expanded);
    });
  }

  const search = document.querySelector("#menu-search");
  const cards = [...document.querySelectorAll(".menu-card")];
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const count = document.querySelector("#menu-result-count");
  const empty = document.querySelector("#menu-empty");
  let activeFilter = "all";
  function updateMenu() {
    const term = (search?.value || "").trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
      const matchesText = (card.dataset.name + " " + card.textContent).toLowerCase().includes(term);
      const show = matchesCategory && matchesText;
      card.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = `Showing ${visible} of ${cards.length} sample menu items`;
    if (empty) empty.hidden = visible !== 0;
  }
  search?.addEventListener("input", updateMenu);
  const searchForm = document.querySelector("#menu-search-form");
  searchForm?.addEventListener("submit", event => {
    event.preventDefault();
    updateMenu();
    document.querySelector(".menu-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.querySelector("#menu-clear")?.addEventListener("click", () => {
    if (search) search.value = "";
    activeFilter = "all";
    filterButtons.forEach(item => {
      const selected = item.dataset.filter === "all";
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    updateMenu();
    search?.focus();
  });
  document.querySelectorAll(".item-detail-button").forEach(button => button.addEventListener("click", () => {
    const detail = button.parentElement?.querySelector(".item-detail");
    if (!detail) return;
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    detail.hidden = expanded;
    button.textContent = expanded ? "View details" : "Hide details";
  }));
  filterButtons.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    updateMenu();
  }));

  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  form?.addEventListener("submit", event => {
    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
      if (status) status.textContent = "Please correct the highlighted fields before submitting.";
      return;
    }
    const message = form.querySelector("#message");
    if (message && message.value.trim().length < 10) {
      event.preventDefault();
      message.setCustomValidity("Please enter at least 10 characters.");
      message.reportValidity();
      message.addEventListener("input", () => message.setCustomValidity(""), { once: true });
      if (status) status.textContent = "Your message needs a little more detail.";
      return;
    }
    if (status) status.textContent = "Validation passed. The form will send only after a real recipient is configured.";
    // Keep the submission available for the configured endpoint; do not block a valid POST.
  });

  const mapEl = document.querySelector("#map");
  if (mapEl && window.L) {
    mapEl.textContent = "";
    const map = L.map(mapEl, { scrollWheelZoom: false }).setView([-29.6006, 30.3794], 11);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> — Sources: Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), GIS User Community'
    }).addTo(map);
    L.marker([-29.6006, 30.3794]).addTo(map).bindPopup("Pietermaritzburg area<br>Business address not verified.");
  }
});