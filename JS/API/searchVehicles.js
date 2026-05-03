const GRAPH_API = "http://localhost:4000/graphql";

async function getVehicles(filters) {
  const response = await fetch(GRAPH_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: `query GetVehicles(
        $brand: String
        $model: String
        $status: String
        $minYear: Int
        $maxYear: Int
        $minPrice: Float
        $maxPrice: Float
        $page: Int
        $limit: Int
      ) {
        vehicles(
          brand: $brand
          model: $model
          status: $status
          minYear: $minYear
          maxYear: $maxYear
          minPrice: $minPrice
          maxPrice: $maxPrice
          page: $page
          limit: $limit
        ) {
          total
          page
          totalPages
          results {
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
        }
      }`,
      variables: {
        brand: filters.brand || null,
        model: filters.model || null,
        status: filters.status || null,
        minYear: filters.minYear ? parseInt(filters.minYear) : null,
        maxYear: filters.maxYear ? parseInt(filters.maxYear) : null,
        minPrice: filters.minPrice ? parseFloat(filters.minPrice) : null,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : null,
        page: filters.page ? parseInt(filters.page) : 1,
        limit: filters.limit ? parseInt(filters.limit) : 10
      }
    })
  });

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(errors[0].message || "No se pudieron cargar los vehículos.");
  }

  return data.vehicles;
}
