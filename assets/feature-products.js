async function updateSections(sections) {
  try {
    const res = await fetch("/?sections=cart-icon-bubble,cart-drawer");
    const data = await res.json();

    const bubble = document.querySelector(".cart-count-bubble");
    console.log("bubble", bubble);

    if (bubble && data["cart-icon-bubble"]) {
      bubble.innerHTML = data["cart-icon-bubble"];
    }
    const drawer = window.cartDrawerInstance;
    console.log("drawer", drawer); // undefined 
    if (drawer && typeof drawer.renderContents === "function" && data["cart-drawer"]) {
      drawer.renderContents(data);
      drawer.open();
    }
  } catch (err) {
    console.error(err);
  }
}

async function addToCart(variantId, btn) {
  if (!variantId) return;
  btn.disabled = true;

  try {
    const addRes = await fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: +variantId, quantity: 1 })
    });

    if (!addRes.ok) throw new Error("Failed to add product");

    await updateSections();
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
    const res = await fetch(sectionUrl);
    if (!res.ok) throw new Error("Failed to fetch sorted section");

    const data = await res.json();
    const newSectionHTML = data[`feature-products-${sectionId}`];

    if (newSectionHTML) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = newSectionHTML;
      const newSectionEl = tempDiv.firstElementChild;
      section.replaceWith(newSectionEl);
    }

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
    console.log(btn); // <button type="submit" id="add-to-cart-55708638511452" class="add-to-cart-btn" aria-label="Add Nike Air Max Plus to cart">Add to cart</button>

    const variantId = form.querySelector('input[name="id"]')?.value;
    const quantity = form.querySelector('input[name="quantity"]')?.value || 1;
    console.log(variantId, quantity); // 55708638511452,  1

    addToCart(variantId, btn, +quantity);
  });

  document.addEventListener("change", (e) => {
    if (!e.target.matches('[id^="SortBy-"]')) return;
    sortFeatureProducts(e.target);
  });
});
