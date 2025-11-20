document.addEventListener("DOMContentLoaded", function () {
  const thumbsSwiperEl = document.querySelector(".mySwiper");
  const mainSwiperEl = document.querySelector(".mySwiper2");
  const colorSelect = document.querySelector("#color-select");
  const sizeSelect = document.querySelector("#size-select");
  const variantInput = document.querySelector("#selected-variant-id");
  const variantContainer = document.querySelector("#variant-data");
  const addToCartBtn = document.querySelector(".add-to-cart-button");
  const messageBox = document.querySelector(".form-message");

  if (!thumbsSwiperEl || !mainSwiperEl || !variantContainer) return;

  const allThumbSlides = Array.from(document.querySelectorAll(".mySwiper .swiper-slide"));
  const mainSlides = Array.from(document.querySelectorAll(".mySwiper2 .swiper-slide"));
  const colorRadios = document.querySelectorAll(".color-input");

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

  const thumbsSwiper = new Swiper(".mySwiper", {
    loop: false,
    spaceBetween: 16,
    slidesPerView: "auto",
    freeMode: true,
    watchSlidesProgress: true,
    direction: "horizontal",
    breakpoints: {
      0: { spaceBetween: 16, direction: "horizontal" },
      768: { spaceBetween: 16, direction: "horizontal" },
      1024: { spaceBetween: 16, direction: "horizontal" },
      1280: { spaceBetween: 24, direction: "vertical" }
    }
  });

  const mainSwiper = new Swiper(".mySwiper2", {
    loop: mainSlides.length > 1,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    thumbs: { swiper: thumbsSwiper }
  });

  function updateMainImage(mediaId) {
    if (!mediaId) return;
    const index = mainSlides.findIndex((s) => s.dataset.mediaId === mediaId);
    if (index >= 0 && mainSwiper) mainSwiper.slideTo(index);
  }

  function updateThumbnailsForColor(color) {
    allThumbSlides.forEach((slide) => {
      const slideColor = slide.dataset.mediaColor?.toLowerCase();
      const shouldShow = !color || (slideColor && slideColor === color.toLowerCase());
      slide.classList.toggle("hidden", !shouldShow);
    });
    thumbsSwiper.update();
  }

  if (colorRadios.length && colorSelect) {
    colorRadios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        colorSelect.value = e.target.value;
        colorSelect.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
  }

  function getSelectedSize() {
    const checked = document.querySelector('input[name="size"]:checked');
    return checked ? checked.value : null;
  }

  let currentMessageType = null;
  function showMessage(text, type = "error") {
    if (!messageBox) return;

    messageBox.textContent = text;
    messageBox.classList.remove("text-red-500", "text-green-500", "opacity-0", "invisible", "pointer-events-none");
    messageBox.classList.add(type === "error" ? "text-red-500" : "text-green-500");
    messageBox.classList.add("opacity-100");
    messageBox.classList.remove("invisible", "pointer-events-none");

    currentMessageType = type;
  }

  function hideErrorMessage() {
    if (!messageBox || currentMessageType !== "error") return;
    messageBox.classList.remove("opacity-100", "text-red-500");
    messageBox.classList.add("opacity-0", "invisible", "pointer-events-none");
    currentMessageType = null;
  }
  let hasInteracted = false;
  function updateVariant() {
    const color = colorSelect?.value;
    const size = getSelectedSize();
    const variant = findVariant(color, size);
    if (!variant) return;
    variantInput.value = variant.id;
    updateMainImage(variant.mediaId);
    updateThumbnailsForColor(color);

    if (variant.available) {
      addToCartBtn.disabled = false;
      addToCartBtn.textContent = "Add to Cart";
      hideErrorMessage();
    } else {
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = "Sold Out";
      if (hasInteracted && color && size) {
        showMessage(`Variant ${size}/${color} is currently unavailable.`, "error");
      }
    }
  }

  colorSelect?.addEventListener("change", () => {
    hasInteracted = true;
    updateVariant();
  });

  document.querySelectorAll('input[name="size"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      hasInteracted = true;
      updateVariant();
    });
  });
  updateVariant();

  addToCartBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const variantId = variantInput.value;

    if (!variantId || addToCartBtn.disabled) {
      showMessage("Cannot add this variant to cart.");
      return;
    }

    addToCartBtn.disabled = true;
    addToCartBtn.textContent = "Adding...";

    try {
      let formData = {
        items: [
          {
            id: variantId,
            quantity: 1
          }
        ]
      };

      const response = await fetch(window.Shopify.routes.root + "cart/add.js", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      showMessage("Added to cart!", "success");
      return data;
    } catch (err) {
      showMessage("Network error. Please try again.", err);
    } finally {
      updateVariant();
    }
  });

  thumbsSwiperEl.addEventListener("click", (e) => {
    const slide = e.target.closest(".swiper-slide");
    if (!slide) return;
    const mediaId = slide.dataset.mediaId;
    if (!mediaId) return;
    updateMainImage(mediaId);
  });
});
