/*const API_Padron = "http://localhost:3000";

async function getPadronByCedula(cedula) {
  const response = await fetch(`${API_Padron}/api/padron/${cedula}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  // Primero revisa el status
  if (!response.ok) {
    // Intentar extraer mensaje del backend
    let errorMessage = "Cédula no encontrada en el padrón";
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) errorMessage = errorData.error;
    } catch (e) { }
    throw new Error(errorMessage);
  }

  // Parsear la respuesta real
  const data = await response.json();
  return data;
}

// queda global para poder usarlo en auth.js sin problemas de importación
window.getPadronByCedula = getPadronByCedula;*/