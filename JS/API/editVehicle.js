const GRAPH_API = "http://localhost:4000/graphql";
const VEHICLE_API = "http://localhost:3000/api/vehicle";

async function getVehicleById(id) {
  const response = await fetch(GRAPH_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: `query GetVehicle($id: ID!) {
        vehicle(id: $id) {
          id
          brand
          model
          description
          year
          price
          image_path
          status
          createdAt
          owner {
            id
            name
            last_name
            email
          }
        }
      }`,
      variables: { id }
    })
  });

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(errors[0].message || "No se pudo cargar el vehículo.");
  }

  return data.vehicle;
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
