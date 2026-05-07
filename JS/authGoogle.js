async function googleResponse(response) {
  try {
    const data = await loginWithGoogle(response.credential);
    sessionStorage.setItem("token", data.token);

    if (data.needsExtraData) { // new Google users dont have an ID number yet
      document.getElementById("idModal").classList.remove("hidden");
      return;
    }

    window.location.href = "../HTML/index.html";

  } catch (error) {
    console.error("Google login error:", error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  google.accounts.id.initialize({
    client_id: CONFIG.GOOGLE_CLIENT_ID,
    callback: googleResponse
  });

  google.accounts.id.renderButton(
    document.getElementById("googleBtn"),
    {
      theme: "outline",
      size: "large",
      width: 387
    }
  );

   document.getElementById("saveProfileBtn").addEventListener("click", async () => {
    const id_number = document.getElementById("idNumber").value.trim();
    const errorBox = document.getElementById("cedulaError");
    const btn = document.getElementById("saveProfileBtn");

    if (!id_number) {
      errorBox.style.display = "block";
      errorBox.textContent = "La cédula es obligatoria.";
      errorBox.style.color = "#f87171";
      return;
    }

    errorBox.textContent = "";
    errorBox.style.display = "none";
    btn.disabled = true;
    btn.textContent = "Verificando...";

    try {
      await getPadronByCedula(id_number); // validate cedula exists in padron
    } catch (err) {
      errorBox.style.display = "block";
      errorBox.textContent = "La cédula no está registrada en el padrón electoral.";
      errorBox.style.color = "#f87171";
      btn.disabled = false;
      btn.textContent = "Guardar y continuar";
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      await completeProfile({ id_number }, token);
      window.location.href = "../HTML/index.html";
    } catch (err) {
      errorBox.style.display = "block";
      errorBox.textContent = "No se pudo guardar la cédula, intenta de nuevo.";
      errorBox.style.color = "#f87171";
      btn.disabled = false;
      btn.textContent = "Guardar y continuar";
    }
  });
});