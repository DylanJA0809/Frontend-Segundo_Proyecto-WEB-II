const API = "http://localhost:3000/api/vehicle";

async function getVehicles(filters) {
  const params = new URLSearchParams();

  if (filters.brand) params.append("brand", filters.brand);
  if (filters.model) params.append("model", filters.model);
  if (filters.status) params.append("status", filters.status);
  if (filters.minYear) params.append("minYear", filters.minYear);
  if (filters.maxYear) params.append("maxYear", filters.maxYear);
  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

  params.append("page", filters.page);
  params.append("limit", filters.limit);

  const response = await fetch(`${API}?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error("No se pudieron cargar los vehículos.");
  }

  return data;
}