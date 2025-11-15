document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ContactForm");
  if (!form) return;

  const honeypot = form.querySelector('input[name="contact[honeypot]"]');

  if (!honeypot) return;

  honeypot.setAttribute("tabindex", "-1");
  honeypot.style.display = "none";
  honeypot.setAttribute("aria-hidden", "true");
  honeypot.value = "";

  form.addEventListener("submit", function (e) {
    if (honeypot.value.trim() !== "") {
      e.preventDefault();
      console.warn("Spam bot detected — form not submitted.");
    }
  });
});
