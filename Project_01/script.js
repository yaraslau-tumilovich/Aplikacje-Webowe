const form = document.querySelector("#contact-form");

if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.querySelector("#email");
    const message = document.querySelector("#message");
    const status = document.querySelector("#form-status");

    if (!email.validity.valid) {
      status.textContent = "Wpisz poprawny adres e-mail.";
      email.focus();
      return;
    }

    if (message.value.trim().length < 10) {
      status.textContent = "Wiadomość musi mieć co najmniej 10 znaków.";
      message.focus();
      return;
    }

    status.textContent =
      "Dziękujemy! Formularz został poprawnie wypełniony. To wersja demonstracyjna.";

    form.reset();
  });
}
