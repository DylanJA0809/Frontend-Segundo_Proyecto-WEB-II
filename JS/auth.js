document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("authForm");
  const msgBox = document.getElementById("msgBox");
  const card = document.getElementById("authCard");
  const btn = document.getElementById("submitBtn");
  const pendingModal = document.getElementById("pendingModal");
  const twoFAModal = document.getElementById("twoFAModal");

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
    if (pendingModal) pendingModal.classList.remove("hidden");
  }

  function show2FAModal() {
    if (twoFAModal) twoFAModal.classList.remove("hidden");
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

  // Lógica del modal 2FA
  const verify2FABtn = document.getElementById("verify2FABtn");
  const twoFAMsg = document.getElementById("twoFAMsg");

  if (verify2FABtn) {
    verify2FABtn.addEventListener("click", async () => {
      const code = document.getElementById("twoFACode").value.trim();
      const emailInput = form.querySelector('input[name="email"]');
      const email = emailInput ? emailInput.value.trim() : "";

      if (!code || code.length !== 6) {
        twoFAMsg.className = "msg error";
        twoFAMsg.textContent = "Ingresá un código de 6 dígitos.";
        return;
      }

      verify2FABtn.disabled = true;
      verify2FABtn.textContent = "Verificando...";

      try {
        const data = await verify2FA(email, code);

        const token = data.token || data.accessToken;
        if (!token) throw new Error("No se recibió el token.");

        sessionStorage.setItem("token", token);

        twoFAMsg.className = "msg success";
        twoFAMsg.textContent = "Verificación exitosa.";

        setTimeout(() => {
          window.location.href = "../HTML/index.html";
        }, 800);

      } catch (error) {
        twoFAMsg.className = "msg error";
        twoFAMsg.textContent = error.message;
        verify2FABtn.disabled = false;
        verify2FABtn.textContent = "Verificar";
      }
    });
  }

  // Autocompletar desde padrón (solo en registro)
  const cedulaInput = document.getElementById('id_number');
  const nameInput = document.getElementById('name');
  const lastNameInput = document.getElementById('last_name');

  if (cedulaInput) {
    cedulaInput.addEventListener('blur', async () => {
      const cedula = cedulaInput.value.trim();

      if (!cedula) return;

      showMessage("info", "Consultando padrón electoral...");

      try {
        const data = await getPadronByCedula(cedula);

        if (nameInput) {
          nameInput.value = data.name;
          nameInput.readOnly = true;
        }
        if (lastNameInput) {
          lastNameInput.value = data.last_name;
          lastNameInput.readOnly = true;
        }

        showMessage("success", "Datos encontrados en el padrón electoral.");

      } catch (error) {
        if (nameInput) { nameInput.value = ""; nameInput.readOnly = false; }
        if (lastNameInput) { lastNameInput.value = ""; lastNameInput.readOnly = false; }
        showMessage("error", error.message);
        shake();
      }
    });
  }

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
      const isRegister = form.querySelector('input[name="name"]');

      if (isRegister) {
        const userData = {
          id_number: form.id_number.value.trim(),
          email: form.email.value.trim(),
          password: form.password.value.trim(),
          phone: form.phone.value.trim(),
        };

        await registerUser(userData);
        showPendingModal();

      } else {
        // LOGIN — el backend envía el SMS y pide el código 2FA
        const data = await loginUser(
          form.email.value.trim(),
          form.password.value.trim()
        );

        if (data.requires2FA) {
          showMessage("success", data.message);
          show2FAModal();
        }
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
        btn.disabled = false;
        btn.textContent = oldText || "Enviar";
      }
    }
  });
});
