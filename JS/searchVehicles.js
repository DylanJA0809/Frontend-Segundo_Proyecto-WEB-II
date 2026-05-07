document.addEventListener("DOMContentLoaded", () => {
  const toggleFiltersBtn = document.getElementById("toggleFiltersBtn");
  const filtersPanel = document.getElementById("filtersPanel");
  const filterArrow = document.getElementById("filterArrow");
  const filterForm = document.getElementById("filterForm");
  const clearBtn = document.getElementById("clearBtn");
  const cards = document.querySelectorAll(".vehicle-card");
  const vehiclesContainer = document.getElementById("vehiclesContainer");
  const resultsInfo = document.getElementById("resultsInfo");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageInfo = document.getElementById("pageInfo");
  const defaultCarImage = "../img/default-car.jpg";
  let currentPage = 1;
  let limit = 6;
  let totalPages = 1;
  setupEvents();
  loadVehicles();

  function setupEvents() {
    if (toggleFiltersBtn) {
      toggleFiltersBtn.addEventListener("click", openOrCloseFilters);
    }

    if (filterForm) {
      filterForm.addEventListener("submit", handleSearch);
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", clearFilters);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", goToPreviousPage);
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", goToNextPage);
    }
  }

  function openOrCloseFilters() {
    filtersPanel.classList.toggle("open");
    filterArrow.classList.toggle("rotate");
  }

  async function handleSearch(event) {
    event.preventDefault();
    currentPage = 1;
    await loadVehicles();
  }

  async function clearFilters() {
    filterForm.reset();
    currentPage = 1;
    await loadVehicles();
  }

  async function goToPreviousPage() {
    if (currentPage > 1) {
      currentPage--;
      await loadVehicles();
    }
  }

  async function goToNextPage() {
    if (currentPage < totalPages) {
      currentPage++;
      await loadVehicles();
    }
  }

  function getFilters() {
    return {
      brand: document.getElementById("brand").value.trim(),
      model: document.getElementById("model").value.trim(),
      minYear: document.getElementById("minYear").value,
      maxYear: document.getElementById("maxYear").value,
      minPrice: document.getElementById("minPrice").value,
      maxPrice: document.getElementById("maxPrice").value,
      status: document.getElementById("status").value,
      page: currentPage,
      limit: limit
    };
  }

  async function loadVehicles() {
    showLoadingMessage();

    try {
      const filters = getFilters();
      const data = await getVehicles(filters);

      const vehicles = data.results || [];
      const totalVehicles = data.total || 0;

      totalPages = Math.ceil(totalVehicles / limit);
      if (totalPages < 1) {
        totalPages = 1;
      }

      renderVehicles(vehicles);
      updatePaginationInfo(totalVehicles);

    } catch (error) {
      showErrorMessage(error.message);
    }
  }

  function showLoadingMessage() {
    vehiclesContainer.innerHTML = `
      <p class="text-zinc-400 col-span-full text-center">Cargando vehículos...</p>
    `;
  }

  function showErrorMessage(message) {
    vehiclesContainer.innerHTML = `
      <div class="col-span-full text-center py-10">
        <p class="text-red-400 font-medium">${message}</p>
      </div>
    `;
  }

  function renderVehicles(vehicles) {
    if (vehicles.length === 0) {
      vehiclesContainer.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center text-center py-10">
          <p class="text-zinc-400 text-lg">
            No se encontraron vehículos.
          </p>
        </div>
      `;
      return;
    }

    let html = "";
    vehicles.forEach((vehicle) => {
      html += createVehicleCard(vehicle);
    });

    vehiclesContainer.innerHTML = html;

    addCardEvents();
  }

  function createVehicleCard(vehicle) {
    let image = defaultCarImage;
    if (vehicle.image_path) {
      image = "http://localhost:3000/" + vehicle.image_path;
    }

    let statusClass = "disponible";
    if (vehicle.status === "Vendido") {
      statusClass = "vendido";
    } else if (vehicle.status === "Disponible") {
      statusClass = "disponible";
    }
    const description = getShortDescription(vehicle.description);

    return `
      <article class="vehicle-card fade-up cursor-pointer" data-id="${vehicle.id}">
        <div class="vehicle-image-wrap">
          <img 
            src="${image}" 
            alt="${vehicle.brand} ${vehicle.model}"
            onerror="this.onerror=null; this.src='${defaultCarImage}'"
          />
          <span class="status-badge ${statusClass}">
            ${vehicle.status}
          </span>
        </div>

        <div class="p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-xl font-bold text-white">${vehicle.brand} ${vehicle.model}</h2>
              <p class="text-zinc-400 text-sm">${description}</p>
            </div>
            <span class="text-red-500 font-bold text-lg">
              $${Number(vehicle.price).toLocaleString()}
            </span>
          </div>

          <div class="mt-4 flex items-center gap-3 text-sm text-zinc-400 flex-wrap">
            <span class="spec-pill">${vehicle.year}</span>
            <span class="spec-pill">${vehicle.brand}</span>
            <span class="spec-pill">${vehicle.model}</span>
          </div>

          <button class="mt-5 w-full py-3 rounded-xl bg-zinc-800 hover:bg-red-600 transition font-semibold">
            Ver vehículo
          </button>
        </div>
      </article>
    `;
  }

  function getShortDescription(description) {
    if (!description) {
      return "Sin descripción";
    }

    if (description.length > 60) {
      return description.slice(0, 60) + "...";
    }

    return description;
  }

  function addCardEvents() {
    const cards = document.querySelectorAll(".vehicle-card");

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        goToVehicleDetail(id);
      });
    });
  }

  function updatePaginationInfo(totalVehicles) {
    resultsInfo.textContent = `Se encontraron ${totalVehicles} vehículos`;
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

    updatePaginationButtons();
  }

  function updatePaginationButtons() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    if (prevBtn.disabled) {
      prevBtn.classList.add("opacity-50", "cursor-not-allowed");
    } else {
      prevBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }

    if (nextBtn.disabled) {
      nextBtn.classList.add("opacity-50", "cursor-not-allowed");
    } else {
      nextBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }
  }

  function goToVehicleDetail(id) {
    window.location.href = `vehiclesDetails.html?id=${id}`;
  }
});