const initSwiper = (containerSelector = ".slider-products") => {
  const sliders = document.querySelectorAll(containerSelector);

  sliders.forEach((slider) => {
    const slideCount = slider.querySelectorAll(".swiper-slide").length;

    new Swiper(slider, {
      slidesPerView: 1.1,
      spaceBetween: 16,
      loop: true,
      mousewheel: true,
      keyboard: true,
      watchOverflow: true,
      navigation: {
        nextEl: slider.querySelector(".swiper-button-next"),
        prevEl: slider.querySelector(".swiper-button-prev")
      },
      breakpoints: {
        425: { slidesPerView: 2, spaceBetween: 16 },
        768: { slidesPerView: 2.5, spaceBetween: 24 },
        1024: { slidesPerView: 4, spaceBetween: 24 }
      },
      on: {
        init: function () {
          let slidesPerView = this.params.slidesPerView;
          if (this.params.breakpoints) {
            const viewportWidth = window.innerWidth;
            const breakpoints = this.params.breakpoints;
            Object.keys(breakpoints).forEach((breakpointKey) => {
              const breakpointWidth = parseInt(breakpointKey, 10);
              const settings = breakpoints[breakpointKey];

              if (viewportWidth >= breakpointWidth) {
                slidesPerView = settings.slidesPerView;
              }
            });
          }

          const prevBtn = slider.querySelector(".swiper-button-prev");
          const nextBtn = slider.querySelector(".swiper-button-next");
          if (slideCount <= slidesPerView) {
            if (prevBtn) prevBtn.style.display = "none";
            if (nextBtn) nextBtn.style.display = "none";
          } else {
            if (prevBtn) prevBtn.style.display = "";
            if (nextBtn) nextBtn.style.display = "";
          }
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
