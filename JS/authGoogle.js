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
    const id_number = document.getElementById("idNumber").value;
    if (!id_number) {
      alert("Por favor ingresa tu cédula!");
      return;
    }
    try {
      const token = sessionStorage.getItem("token");
      await completeProfile({ id_number }, token);
      window.location.href = "../HTML/index.html";
    } catch (err) {
      alert("No se pudo guardar la cédula, Intenta de nuevo!");
    }
  });
});