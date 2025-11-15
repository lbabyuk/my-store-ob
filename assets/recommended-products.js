class RecommendedProducts extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.loadRecommendedProducts();
  }

  disconnectedCallback() {
    if (this.swiperInstance?.destroy) {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }
  }

  async loadRecommendedProducts() {
    const URL = `${window.Shopify.routes.root}recommendations/products?product_id=${this.dataset.productId}&section_id=${this.dataset.sectionId}`;
    const response = await fetch(URL);
    const responseHTML = await response.text();
    const html = document.createElement("div");
    html.innerHTML = responseHTML;

    const newRecommendations = html.querySelector("recommended-products");

    if (newRecommendations && newRecommendations?.innerHTML.trim().length) {
      this.innerHTML = newRecommendations.innerHTML;

      if (this.querySelector(".slider-products")) {
        initSwiper();
      }
    }
  }
}

customElements.define("recommended-products", RecommendedProducts);
