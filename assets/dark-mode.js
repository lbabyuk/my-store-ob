document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  const html = document.documentElement;
  const dot = toggle.querySelector(".dot");

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    html.classList.add("dark");
    dot.classList.add("translate-x-6");
  }

  toggle.addEventListener("click", () => {
    html.classList.toggle("dark");
    dot.classList.toggle("translate-x-6");
    localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
  });
});
