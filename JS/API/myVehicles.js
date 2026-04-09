const API = "http://localhost:3000";

async function getCurrentUser(token) {
  const response = await fetch(API + "/api/auth/user", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "No se pudo obtener el usuario.");
  }

  return data;
}

async function getAllVehicles() {
  const response = await fetch(API + "/api/vehicle");
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error("No se pudieron cargar los vehículos.");
  }

  return data;
}