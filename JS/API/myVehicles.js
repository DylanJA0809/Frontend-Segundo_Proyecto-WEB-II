const API = "http://localhost:3000";
const GRAPH_API = "http://localhost:4000/graphql";

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

async function getAllVehicles(token) {
  const response = await fetch(GRAPH_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `query {
        vehiclesByUser {
          id
          brand
          model
          description
          year
          price
          image_path
          status
          createdAt
        }
      }`
    })
  });

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(errors[0].message || "No se pudieron cargar los vehículos.");
  }

  return data.vehiclesByUser;
}
