async function updateSections() {
  try {
    const res = await fetch("/cart.js");
    const data = await res.json();

    const bubble = document.querySelector(".cart-count-bubble");
    if (bubble) bubble.textContent = data.item_count;

    const cartNotification = document.querySelector("cart-notification");

    if (cartNotification && typeof cartNotification.renderContents === "function") {
      cartNotification.renderContents(data);
    }
  } catch (err) {
    console.error(err);
  }
}

async function addToCart(variantId, btn) {
  if (!variantId) return;
  btn.disabled = true;

  try {
    const formData = {
      items: [{ id: Number(variantId), quantity: 1 }]
    };

    const res = await fetch(window.Shopify.routes.root + `cart/add.js`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (!res.ok) throw new Error("Failed to add product");

    await updateSections();
    const cartNotification = document.querySelector("cart-notification");

    if (cartNotification) cartNotification.open();
  } catch (err) {
    console.error(err);
  } finally {
    btn.disabled = false;
  }
}

async function sortFeatureProducts(select) {
  const section = select.closest('[id^="feature-products-"]');
  const sectionId = section?.id.replace("feature-products-", "");
  if (!sectionId) return;

  const sortBy = select.value;

  try {
    const sectionUrl = `${window.location.pathname}?sections=feature-products-${sectionId}&sort_by=${sortBy}`;
    console.log(sectionUrl);

    const res = await fetch(sectionUrl);

    if (!res.ok) throw new Error("Failed to fetch sorted section");

    const newHTML = await res.text();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = newHTML;
    const newSectionEl = tempDiv.querySelector(`#feature-products-${sectionId}`);

    if (newSectionEl) section.replaceWith(newSectionEl);

    const url = new URL(window.location.href);

    url.searchParams.set("sort_by", sortBy);
    window.history.replaceState({}, "", url);
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("submit", (e) => {
    const form = e.target.closest(".add-to-cart-form");
    if (!form) return;

    e.preventDefault();

    const btn = form.querySelector(".add-to-cart-btn");
    const variantId = form.querySelector('input[name="id"]')?.value;
    const quantity = form.querySelector('input[name="quantity"]')?.value || 1;

    addToCart(variantId, btn, +quantity);
  });

  document.addEventListener("change", (e) => {
    if (!e.target.matches('[id^="SortBy-"]')) return;
    sortFeatureProducts(e.target);
  });
});
