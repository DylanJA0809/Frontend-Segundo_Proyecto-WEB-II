const GRAPH_API = "http://localhost:4000/graphql";

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
