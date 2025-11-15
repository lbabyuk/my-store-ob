document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#product-recommendations");
  if (!section) return;

  const productId = section.dataset.productId;
  const sectionId = section.dataset.sectionId;
  const URL = `${window.Shopify.routes.root}recommendations/products?product_id=${productId}&section_id=${sectionId}&intent=related`;

  fetch(URL)
    .then((response) => response.text())
    .then((htmlText) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlText;

      const newRecommendations = tempDiv.querySelector("#product-recommendations");
      if (newRecommendations && newRecommendations.innerHTML.trim().length) {
        section.innerHTML = newRecommendations.innerHTML;

        const event = new CustomEvent("recommendations:loaded", {
          detail: { section }
        });
        document.dispatchEvent(event);
      }
    })
    .catch((err) => console.error("Error fetching related products:", err));
});
