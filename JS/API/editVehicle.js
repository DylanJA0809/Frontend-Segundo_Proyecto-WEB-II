const VEHICLE_API = "http://localhost:3000/api/vehicle";

async function getVehicleById(id) {
  const response = await fetch(`${VEHICLE_API}?id=${id}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error("No se pudo cargar el vehículo.");
  }

  return data;
}

async function updateVehicle(vehicleData, token) {
  const response = await fetch(VEHICLE_API, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(vehicleData)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "No se pudo actualizar el vehículo.");
  }

  return data;
}

async function deleteVehicle(id, token) {
  const response = await fetch(`http://localhost:3000/api/vehicle?id=${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar el vehículo.");
  }

  return true;
}