document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ContactForm");
  if (!form) return;

  const submitButton = form.querySelector(".help-btn");
  if (!submitButton) return;

  form.addEventListener("submit", function (e) {
    const honeypot = form.querySelector('input[name="contact[honeypot]"]');
    if (honeypot && honeypot.value.trim() !== "") return;

    form.setAttribute("aria-busy", "true");
    submitButton.disabled = true;
    submitButton.classList.add("is-loading");
    submitButton.textContent = "Sending...";
  });
});
