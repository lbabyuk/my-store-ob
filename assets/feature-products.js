document.addEventListener("DOMContentLoaded", () => {
  const sectionEl = document.querySelector('[id^="feature-products-"]');
  if (!sectionEl) return;

  const sectionId = sectionEl.id.replace("feature-products-", "");
  const sortSelect = sectionEl.querySelector(`#SortBy-${sectionId}`);

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".add-to-cart-btn");
    if (!btn) return;

    const variantId = btn.dataset.variantId;
    if (!variantId) return;

    try {
      const addResponse = await fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          id: parseInt(variantId),
          quantity: 1
        })
      });

      if (!addResponse.ok) {
        const errorText = await addResponse.text();
        throw new Error(`${errorText}`);
      }

      const sectionsToRender = ["cart-drawer", "cart-icon-bubble"];
      const res = await fetch(`/?sections=${sectionsToRender.join(",")}`);
      const data = await res.json();
      sectionsToRender.forEach((section) => {
        const sectionEl = document.querySelector(`[data-section-id="${section}"]`);
        if (sectionEl && data[section]) {
          sectionEl.innerHTML = data[section];
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
      }, 1500);
    }
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", async (e) => {
      const sortValue = e.target.value;

      const url = new URL(window.location.href);
      url.searchParams.set("sort_by", sortValue);

      try {
        const res = await fetch(`${url.pathname}?section_id=${sectionId}&sort_by=${sortValue}`);
        const html = await res.text();
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, "text/html");
        const newSection = newDoc.querySelector(`#feature-products-${sectionId}`);
        if (newSection) {
          sectionEl.replaceWith(newSection);
        }
        window.history.replaceState({}, "", url);
      } catch (err) {
        console.error(err);
      }
    });
  }
});
