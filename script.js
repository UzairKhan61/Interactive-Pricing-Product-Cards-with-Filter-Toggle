const YEARLY_DISCOUNT = 0.8;

const plans = [
  {
    id: "starter",
    category: "basic",
    name: "Starter",
    description: "A focused workspace for solo makers shipping their first product.",
    monthly: 9,
    popular: false,
    cta: "Start free trial",
    iconClass: "icon-starter",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3l2.4 6.6H21l-5.4 3.9 2.1 6.5L12 16.8 6.3 20l2.1-6.5L3 9.6h6.6L12 3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `,
    features: ["1 workspace", "5 GB storage", "Email support", "Core templates"],
  },
  {
    id: "creator",
    category: "basic",
    name: "Creator",
    description: "More room for content, clients, and a small growing team.",
    monthly: 19,
    popular: false,
    cta: "Choose Creator",
    iconClass: "icon-creator",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="5" width="16" height="14" rx="3" stroke="currentColor" stroke-width="1.8"/>
        <path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,
    features: ["3 workspaces", "50 GB storage", "Priority chat", "Brand kit & exports"],
  },
  {
    id: "pro",
    category: "premium",
    name: "Pro",
    description: "The sweet spot for growing teams that want automation and insights.",
    monthly: 39,
    popular: true,
    cta: "Go Pro",
    iconClass: "icon-pro",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 16l3.2-8h7.6L19 16H5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M9 16v3h6v-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,
    features: ["Unlimited workspaces", "200 GB storage", "Automation rules", "Advanced analytics"],
  },
  {
    id: "studio",
    category: "premium",
    name: "Studio",
    description: "White-glove scale for agencies that need control, SSO, and SLAs.",
    monthly: 79,
    popular: false,
    cta: "Talk to sales",
    iconClass: "icon-studio",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 19V8l8-4 8 4v11" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M9 19v-6h6v6" stroke="currentColor" stroke-width="1.8"/>
      </svg>
    `,
    features: ["Custom roles & SSO", "1 TB storage", "Dedicated success manager", "99.9% uptime SLA"],
  },
];

const grid = document.getElementById("plans-grid");
const toggle = document.getElementById("billing-toggle");
const billing = document.querySelector(".billing");
const statusEl = document.getElementById("filter-status");
const filterButtons = document.querySelectorAll(".filter-btn");

let yearly = false;
let category = "all";

function formatPrice(monthly) {
  const value = yearly ? Math.round(monthly * YEARLY_DISCOUNT) : monthly;
  return `$${value}`;
}

function periodLabel() {
  return yearly ? "/mo, billed yearly" : "/month";
}

function createCard(plan) {
  const card = document.createElement("article");
  card.className = `card${plan.popular ? " popular" : ""}`;
  card.dataset.category = plan.category;
  card.dataset.id = plan.id;

  card.innerHTML = `
    ${plan.popular ? `<span class="badge">Most Popular</span>` : ""}
    <div class="icon ${plan.iconClass}">${plan.icon}</div>
    <h2>${plan.name}</h2>
    <p class="desc">${plan.description}</p>
    <div class="price-row">
      <span class="price" data-price>${formatPrice(plan.monthly)}</span>
      <span class="period" data-period>${periodLabel()}</span>
    </div>
    <ul class="features">
      ${plan.features.map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <button type="button" class="cta${plan.popular ? " popular-cta" : ""}" data-cta="${plan.id}">
      ${plan.cta}
    </button>
  `;

  return card;
}

function renderCards() {
  grid.innerHTML = "";
  plans.forEach((plan) => grid.appendChild(createCard(plan)));
  applyFilter();
}

function updatePrices() {
  plans.forEach((plan) => {
    const card = grid.querySelector(`[data-id="${plan.id}"]`);
    if (!card) return;
    const priceEl = card.querySelector("[data-price]");
    const periodEl = card.querySelector("[data-period]");
    priceEl.classList.add("is-updating");
    window.setTimeout(() => {
      priceEl.textContent = formatPrice(plan.monthly);
      periodEl.textContent = periodLabel();
      priceEl.classList.remove("is-updating");
    }, 160);
  });
}

function applyFilter() {
  const cards = [...grid.querySelectorAll(".card")];
  let visible = 0;

  cards.forEach((card) => {
    const match = category === "all" || card.dataset.category === category;
    card.classList.toggle("is-hidden", !match);
    if (match) visible += 1;
  });

  const existingEmpty = grid.querySelector(".empty-state");
  if (existingEmpty) existingEmpty.remove();

  if (visible === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No plans in this category yet.";
    grid.appendChild(empty);
  }

  const label = category === "all" ? "all categories" : `${category} plans`;
  statusEl.textContent = `Showing ${visible} ${visible === 1 ? "plan" : "plans"} in ${label}.`;
}

toggle.addEventListener("click", () => {
  yearly = !yearly;
  toggle.setAttribute("aria-checked", String(yearly));
  billing.classList.toggle("is-yearly", yearly);
  updatePrices();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    category = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");
    applyFilter();
  });
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-cta]");
  if (!button) return;

  const plan = plans.find((item) => item.id === button.dataset.cta);
  button.classList.remove("is-clicked");
  void button.offsetWidth;
  button.classList.add("is-clicked");

  const original = plan.cta;
  button.innerHTML = `<span class="cta-feedback">Added ${plan.name} ✓</span>`;
  window.setTimeout(() => {
    button.textContent = original;
    button.classList.remove("is-clicked");
  }, 1200);
});

renderCards();
