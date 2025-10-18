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
    const formData = { items: [{ id: Number(variantId), quantity: 1 }] };

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

function initFeatureProducts(sectionId) {
  const section = document.getElementById(`shopify-section-${sectionId}`);
  if (!section) return;

  const sortSelect = section.querySelector(`#SortBy-${sectionId}`);
  const grid = section.querySelector(".feature-products__grid");
  if (!sortSelect || !grid) return;

  function sortProducts(sortBy) {
    const initialProducts = Array.from(grid.querySelectorAll(".product-card"));
    const products = [...initialProducts];

    products.sort((a, b) => {
      const priceA = parseFloat(a.querySelector(".product-price")?.textContent.replace(/[^0-9.]/g, "")) || 0;
      const priceB = parseFloat(b.querySelector(".product-price")?.textContent.replace(/[^0-9.]/g, "")) || 0;
      const titleA = a.querySelector("h3")?.textContent.trim() || "";
      const titleB = b.querySelector("h3")?.textContent.trim() || "";

      return sortBy === "price-low"
        ? priceA - priceB
        : sortBy === "price-high"
          ? priceB - priceA
          : sortBy === "title-ascending"
            ? titleA.localeCompare(titleB)
            : initialProducts.indexOf(a) - initialProducts.indexOf(b);
    });

    products.forEach((p) => grid.appendChild(p));
  }

  sortSelect.addEventListener("change", () => sortProducts(sortSelect.value));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-section-id]").forEach((section) => {
    initFeatureProducts(section.getAttribute("data-section-id"));
  });

  document.addEventListener("shopify:section:load", (event) => {
    const sectionId = event.target.getAttribute("data-section-id");
    if (sectionId) initFeatureProducts(sectionId);
  });

  document.addEventListener("submit", (e) => {
    const form = e.target.closest(".add-to-cart-form");
    if (!form) return;

    e.preventDefault();
    const btn = form.querySelector(".add-to-cart-btn");
    const variantId = form.querySelector('input[name="id"]')?.value;
    const quantity = form.querySelector('input[name="quantity"]')?.value || 1;

    addToCart(variantId, btn, +quantity);
  });
});
