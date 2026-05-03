const GRAPH_API = "http://localhost:4000/graphql";
const API = "http://localhost:3000";

async function getCurrentUser(token) {
  const response = await fetch(GRAPH_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `query {
        me {
          id
          name
          last_name
          email
          id_number
          status
        }
      }`
    })
  });

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(errors[0].message || "No se pudo obtener el usuario.");
  }

  return data.me;
}

async function createVehicle(formData, token) {
  const response = await fetch(API + "/api/vehicle", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || "No se pudo publicar el vehículo.");
  }

  return data;
}
