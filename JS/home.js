document.addEventListener("DOMContentLoaded", () => {
  const publishBtn = document.getElementById("publishBtn");
  const heroPublishBtn = document.getElementById("heroPublishBtn");
  const loginNavBtn = document.getElementById("loginNavBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const myVehiclesNavBtn = document.getElementById("myVehiclesNavBtn");

  updateAuthButtons();

  if (publishBtn) {
    publishBtn.addEventListener("click", goToPublishOrLogin);
  }

  if (heroPublishBtn) {
    heroPublishBtn.addEventListener("click", goToPublishOrLogin);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
  }

  function goToPublishOrLogin(event) {
    const currentToken = sessionStorage.getItem("token");

    if (!currentToken) {
      event.preventDefault();
      window.location.href = "./login.html";
      return;
    }
  }

  function updateAuthButtons() {
    const token = sessionStorage.getItem("token");

    if (token) {
      if (loginNavBtn) {
        loginNavBtn.classList.add("hidden");
      }

      if (logoutBtn) {
        logoutBtn.classList.remove("hidden");
      }

      if (myVehiclesNavBtn) {
        myVehiclesNavBtn.classList.remove("hidden");
      }
    } else {
      if (loginNavBtn) {
        loginNavBtn.classList.remove("hidden");
        loginNavBtn.textContent = "Iniciar sesión";
        loginNavBtn.href = "./login.html";
      }

      if (logoutBtn) {
        logoutBtn.classList.add("hidden");
      }

      if (myVehiclesNavBtn) {
        myVehiclesNavBtn.classList.add("hidden");
      }
    }
  }

  function logoutUser() {
    sessionStorage.removeItem("token");
    window.location.href = "./index.html";
  }
});