const getSlidesPerView = (breakpoints, viewportWidth, defaultSlides = 1.1) => {
  let slidesPerView = defaultSlides;

  for (const [key, settings] of Object.entries(breakpoints)) {
    if (viewportWidth >= +key) slidesPerView = settings.slidesPerView;
  }
  return slidesPerView;
};

const initSwiper = (containerSelector = ".slider-products") => {
  const sliders = document.querySelectorAll(containerSelector);

  sliders.forEach((slider) => {
    const slideCount = slider.querySelectorAll(".swiper-slide").length;

    const viewportWidth = window.innerWidth;

    const breakpoints = {
      425: { slidesPerView: 2, spaceBetween: 16 },
      768: { slidesPerView: 2.5, spaceBetween: 24 },
      1024: { slidesPerView: 4, spaceBetween: 24 }
    };

    const slidesPerView = getSlidesPerView(breakpoints, viewportWidth, 1.1);
    const enableLoop = slideCount > slidesPerView;

    new Swiper(slider, {
      slidesPerView: 1.1,
      spaceBetween: 16,
      loop: enableLoop,
      mousewheel: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      watchOverflow: true,
      navigation: {
        nextEl: slider.querySelector(".swiper-button-next"),
        prevEl: slider.querySelector(".swiper-button-prev")
      },
      lazy: {
        loadPrevNext: true,
        loadOnTransitionStart: true
      },
      preloadImages: false,
      breakpoints: breakpoints,
      on: {
        init: function () {
          const viewportWidth = window.innerWidth;
          const slidesPerView = getSlidesPerView(this.params.breakpoints, viewportWidth, this.params.slidesPerView);
          const prevBtn = slider.querySelector(".swiper-button-prev");
          const nextBtn = slider.querySelector(".swiper-button-next");

          slideCount <= slidesPerView
            ? (prevBtn?.style.setProperty("display", "none"), nextBtn?.style.setProperty("display", "none"))
            : (prevBtn?.style.removeProperty("display"), nextBtn?.style.removeProperty("display"));
        }
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".slider-products")) initSwiper();
});

document.addEventListener("recommendations:loaded", () => {
  initSwiper();
});
