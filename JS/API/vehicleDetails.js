const API = "http://localhost:3000/api/vehicle";

async function getVehicleById(id) {
  const response = await fetch(`${API}?id=${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error("No se pudo cargar el vehículo.");
  }

  return data;
}