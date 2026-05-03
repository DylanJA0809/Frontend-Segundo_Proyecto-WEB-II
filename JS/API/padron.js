const API_Padron = "http://localhost:3000";

async function getPadronByCedula(cedula) {
  const response = await fetch(`${API_Padron}/api/cedula/${cedula}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (!response.ok) {
    let errorMessage = "Cédula no encontrada en el padrón electoral.";
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) errorMessage = errorData.message;
    } catch (e) { }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
}

// queda global para poder usarlo en auth.js sin problemas de importación
window.getPadronByCedula = getPadronByCedula;
