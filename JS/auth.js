document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("authForm");
  const msgBox = document.getElementById("msgBox");
  const card = document.getElementById("authCard");
  const btn = document.getElementById("submitBtn");
  const pendingModal = document.getElementById("pendingModal");

  if (!form) return;

  function showMessage(type, text) {
    msgBox.className = "msg " + type.toLowerCase();
    msgBox.textContent = text;
  }

  function shake() {
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
  }

  function isValidEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  function showPendingModal() {
    alert("showPendingModal llamado, pendingModal: " + (pendingModal ? "ENCONTRADO" : "NULL"));
     if (pendingModal) pendingModal.classList.remove("hidden");
  }

  const activateLaterBtn = document.getElementById("activateLaterBtn");
  if (activateLaterBtn) {
    activateLaterBtn.addEventListener("click", () => {
      pendingModal.classList.add("hidden");
    });
  }

  const goToLoginBtn = document.getElementById("goToLoginBtn");
  if (goToLoginBtn) {
    goToLoginBtn.addEventListener("click", () => {
      window.location.href = "../HTML/login.html";
    });
  }

  const resendBtn = document.getElementById("resendBtn");
  if (resendBtn) {
    resendBtn.addEventListener("click", async () => {
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput || !emailInput.value) {
        showMessage("error", "Ingresa tu correo primero.");
        return;
      }
      try {
        await resendActivationEmail(emailInput.value.trim());
        showMessage("success", "Correo reenviado, revisa tu bandeja.");
        pendingModal.classList.add("hidden");
      } catch (error) {
        showMessage("error", error.message);
      }
    });
  }
  
  // Autocompletar desde padrón
  /*const cedulaInput = document.getElementById('id_number');
  const nameInput = document.getElementById('name');
  const lastNameInput = document.getElementById('last_name');

  if (cedulaInput) {
    cedulaInput.addEventListener('blur', async () => {
      const cedula = cedulaInput.value.trim();

      if (!cedula) return;

      try {
        const data = await getPadronByCedula(cedula);

        if (nameInput) nameInput.value = data.name;
        if (lastNameInput) lastNameInput.value = data.last_name;

      } catch (error) {
        if (nameInput) nameInput.value = "";
        if (lastNameInput) lastNameInput.value = "";

        showMessage("error", error.message);
      }
    });
  }*/

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const requiredFields = form.querySelectorAll("[required]");
    for (const field of requiredFields) {
      if (!field.value.trim()) {
        showMessage("error", "Por favor, completa todos los campos requeridos.");
        shake();
        field.focus();
        return;
      }
    }

    const email = form.querySelector('input[type="email"]');
    if (email && !isValidEmail(email.value.trim())) {
      showMessage("error", "Por favor, introduce un correo electrónico válido.");
      shake();
      email.focus();
      return;
    }

    const pass = form.querySelector('input[name="password"]');
    if (pass && pass.value.length < 6) {
      showMessage("error", "La contraseña debe tener al menos 6 caracteres.");
      shake();
      pass.focus();
      return;
    }

    let oldText = "";
    if (btn) {
      oldText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Cargando...";
    }

    try {
      const isRegister = form.querySelector('input[name="name"]'); // login or register form

      if (isRegister) {
        const userData = {
          id_number: form.id_number.value.trim(),
          name: form.name.value.trim(),
          last_name: form.last_name.value.trim(),
          email: form.email.value.trim(),
          password: form.password.value.trim(),
        };
        
        await registerUser(userData);

        showPendingModal();

      } else {
        // LOGIN
        const data = await loginUser(
          form.email.value.trim(),
          form.password.value.trim()
        );

        const token = data.token || data.accessToken;
        if (!token) throw new Error("El API no devolvió el token.");

        sessionStorage.setItem("token", token);

        showMessage("success", "Inicio de sesión exitoso");

        setTimeout(() => {
          window.location.href = "../HTML/index.html";
        }, 900);
      }

    } catch (error) {
      if (error.pending) {
        showPendingModal();
      } else {
        showMessage("error", error.message);
        shake();
      }
   } finally {
    if (btn) {
      alert("finally ejecutado, oldText:", oldText);
      btn.disabled = false;
      btn.textContent = oldText || "Enviar"; 
    }
  }
  });
});