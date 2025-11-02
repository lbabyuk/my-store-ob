document.addEventListener("DOMContentLoaded", function () {
  const thumbsSwiper = new Swiper(".mySwiper", {
    loop: true,
    spaceBetween: 10,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesProgress: true
  });

  const mainSwiper = new Swiper(".mySwiper2", {
    loop: true,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    thumbs: {
      swiper: thumbsSwiper
    }
  });

  const colorSelect = document.querySelector("#color-select");
  const sizeSelect = document.querySelector("#size-select");
  const variantInput = document.querySelector("#selected-variant-id");
  const variantContainer = document.querySelector("#variant-data");
  const addToCartBtn = document.querySelector(".add-to-cart-button");
  const messageBox = document.querySelector(".form-message");
  const productSection = document.querySelector("[data-section-id]");
  const quantityInput = productSection.querySelector('input[name="quantity"]');
  const reasonInput = document.querySelector("#reason");
  const contactSelect = document.querySelector("#preferred_contact");

  if (!variantContainer) return;

  const colorIndex = parseInt(variantContainer.dataset.colorIndex);
  const sizeIndex = parseInt(variantContainer.dataset.sizeIndex);

  const variants = Array.from(variantContainer.querySelectorAll("span")).map((el) => ({
    id: el.dataset.id,
    option1: el.dataset.option1,
    option2: el.dataset.option2,
    option3: el.dataset.option3,
    mediaId: el.dataset.mediaId,
    available: el.dataset.available === "true"
  }));

  function findVariant(color, size) {
    return variants.find((v) => {
      const colorVal = colorIndex >= 0 ? v[`option${colorIndex + 1}`] : null;
      const sizeVal = sizeIndex >= 0 ? v[`option${sizeIndex + 1}`] : null;
      const colorMatch = color ? colorVal === color : true;
      const sizeMatch = size ? sizeVal === size : true;
      return colorMatch && sizeMatch;
    });
  }

  function updateImagesForVariant(mediaId) {
    if (!mediaId) return;
    const slides = document.querySelectorAll(".mySwiper2 .swiper-slide");
    const index = Array.from(slides).findIndex((s) => s.dataset.mediaId === mediaId);
    if (index >= 0 && mainSwiper) mainSwiper.slideTo(index);
  }

  function showMessage(text, type = "error") {
    if (!messageBox) return;
    messageBox.textContent = text;
    messageBox.style.display = "block";
    messageBox.style.color = type === "error" ? "red" : "green";
    setTimeout(() => (messageBox.style.display = "none"), 5000);
  }

  function updateVariant() {
    const color = colorSelect?.value;
    const size = sizeSelect?.value;
    const variant = findVariant(color, size);

    if (!variant) return;

    variantInput.value = variant.id;
    updateImagesForVariant(variant.mediaId);

    if (variant.available) {
      addToCartBtn.disabled = false;
      addToCartBtn.textContent = "Add to Cart";
    } else {
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = "Sold Out";
      showMessage("This variant is currently unavailable.");
    }
  }

  colorSelect?.addEventListener("change", updateVariant);
  sizeSelect?.addEventListener("change", updateVariant);

  updateVariant();

  addToCartBtn?.addEventListener("click", async (e) => {
    e.preventDefault();

    const variantId = variantInput.value;
    const quantity = quantityInput?.value || 1;
    const reasonValue = reasonInput?.value || "";
    const contactValue = contactSelect?.value || "";

    if (!variantId || addToCartBtn.disabled) {
      showMessage("Cannot add this variant to cart.");
      return;
    }

    if (!reasonValue) {
      showMessage("Please enter a reason for purchase and select preferred contact.");
      return;
    }

    if (!contactValue) {
      showMessage("Please select a preferred contact method.");
      return;
    }

    if (!variantId || addToCartBtn.disabled) {
      showMessage("Cannot add this variant to cart.");
      return;
    }

    addToCartBtn.disabled = true;
    addToCartBtn.textContent = "Adding...";

    const formData = new FormData();
    formData.append("id", variantId);
    formData.append("quantity", quantity);
    formData.append("properties[Reason]", reasonInput.value);
    formData.append("properties[Preferred contact]", contactSelect.value);

    try {
      const response = await fetch("/cart/add.js", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });
      const data = await response.json();

      if (data.status && data.status >= 400) {
        showMessage(data.description || "Error adding to cart.", "error");
        pushDataLayer("form_error");
      } else {
        showMessage("Added to cart successfully!", "success");
        pushDataLayer("form_success", quantity);
      }
    } catch (err) {
      showMessage("Network error. Please try again.", "error");
      pushDataLayer("form_error", null, err.message);
    } finally {
      updateVariant();
    }

    function pushDataLayer(eventType, quantity = null, error = null) {
      window.dataLayer = window.dataLayer || [];
      const payload = {
        event: eventType,
        form_type: "add_to_cart",
        productId: variantInput.value,
        reason: reasonInput.value,
        preferred_contact: contactSelect.value,
        timestamp: new Date().toISOString()
      };
      if (quantity) payload.quantity = quantity;
      if (error) payload.error = error;
      window.dataLayer.push(payload);
    }
  });
});
