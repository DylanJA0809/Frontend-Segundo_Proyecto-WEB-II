document.addEventListener("DOMContentLoaded", () => {
  const message = document.getElementById("message");
  const loginLink = document.getElementById("loginLink");

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (!token) {
    message.textContent = "Token inválido.";
    return;
  }

  activateAccount(token).then(data => {
      message.textContent = data.message;
      loginLink.classList.remove("hidden");
    }).catch(() => {
      message.textContent = "Error al activar la cuenta.";
    });
});