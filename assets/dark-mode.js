if (!window.darkModeInitialized) {
  window.darkModeInitialized = true;
  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");
    const html = document.documentElement;
    const dot = toggle.querySelector(".dot");
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const codes = ["Enter", "Space"];
    const initializeTheme = () => {
      const shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark);
      if (shouldUseDark) {
        html.classList.add("dark");
        dot.classList.add("translate-x-6");
      }
      toggle.setAttribute("aria-checked", shouldUseDark ? "true" : "false");
      toggle.setAttribute("aria-label", shouldUseDark ? "Switch to light mode" : "Switch to dark mode");
    };
    const switchTheme = () => {
      const nowDark = html.classList.toggle("dark");
      dot.classList.toggle("translate-x-6");
      toggle.setAttribute("aria-checked", nowDark ? "true" : "false");
      toggle.setAttribute("aria-label", nowDark ? "Switch to light mode" : "Switch to dark mode");
      localStorage.setItem("theme", nowDark ? "dark" : "light");
    };
    initializeTheme();
    toggle.addEventListener("click", switchTheme);
    toggle.addEventListener("keydown", (event) => {
      if (codes.includes(event.code)) {
        event.preventDefault();
        switchTheme();
      }
    });
  });
}
