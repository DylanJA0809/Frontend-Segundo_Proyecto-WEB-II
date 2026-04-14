async function googleResponse(response) {
  try {
    const data = await loginWithGoogle(response.credential);
    sessionStorage.setItem("token", data.token);

    if (data.needsExtraData) {
      let id_number = "";
      
      while (!id_number || id_number.trim() === "") {
        id_number = prompt("Por favor ingresa tu cédula:");
        if (id_number === null) break; 
      }

      if (id_number) {
        const token = sessionStorage.getItem("token");
        await completeProfile({ id_number: id_number.trim() }, token);
      }
    }
    window.location.href = "../HTML/index.html";

  } catch (error) {
    console.error("Error:", error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  google.accounts.id.initialize({
    client_id: "615312259546-jdrk1hkg4nmi0iil4t3a6nekpe5jagn7.apps.googleusercontent.com",
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
    const token = sessionStorage.getItem("token");
    await completeProfile({ id_number }, token);
    window.location.href = "../HTML/index.html";
  });
});