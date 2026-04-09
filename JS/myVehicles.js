document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("myVehiclesContainer");
  const defaultCarImage = "../img/default-car.jpg";
  const token = sessionStorage.getItem("token");

  loadMyVehicles();

  async function loadMyVehicles() {
    if (!token) {
      window.location.href = "./login.html";
      return;
    }

    try {
      const userData = await getCurrentUser(token);
      const user = userData.user || userData;
      const userId = user._id || user.id || "";

      if (!userId) {
        showError("No se pudo identificar el usuario.");
        return;
      }

      const vehiclesData = await getAllVehicles();
      const vehicles = vehiclesData.results || [];

      const myVehicles = vehicles.filter(vehicle => {
        const ownerId = vehicle.id_user?._id || vehicle.id_user;
        return String(ownerId) === String(userId);
      });

      showVehicles(myVehicles);
    } catch (error) {
      showError(error.message);
    }
  }

  function showVehicles(vehicles) {
    if (!vehicles.length) {
      container.innerHTML = `
        <div class="empty-box fade-up">
          <h3 class="text-2xl font-bold text-white">No tienes vehículos publicados</h3>
          <p class="text-zinc-400 mt-3">Publica tu primer vehículo para verlo aquí.</p>
          <a href="./publishVehicle.html"
            class="inline-block mt-6 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition font-semibold">
            Publicar vehículo
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = vehicles.map(createVehicleCard).join("");
    addCardEvents();
  }

  function showError(message) {
    container.innerHTML = `
      <div class="empty-box fade-up">
        <p class="text-red-400 text-lg font-medium">${message}</p>
      </div>
    `;
  }

  function createVehicleCard(vehicle) {
    let image = defaultCarImage;

    if (vehicle.image_path) {
      image = "http://localhost:3000/" + vehicle.image_path;
    }

    let statusClass = "disponible";
    if (vehicle.status === "Vendido") {
      statusClass = "vendido";
    }

    return `
      <article class="vehicle-card fade-up">
        <div class="vehicle-image-wrap">
          <img
            src="${image}"
            alt="${vehicle.brand} ${vehicle.model}"
            onerror="this.onerror=null; this.src='${defaultCarImage}'"
          />
          <span class="status-badge ${statusClass}">
            ${vehicle.status || "Disponible"}
          </span>
        </div>

        <div class="p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-xl font-bold text-white">${vehicle.brand || ""} ${vehicle.model || ""}</h2>
              <p class="text-zinc-400 text-sm mt-1">
                ${vehicle.description || "Sin descripción"}
              </p>
            </div>

            <span class="text-red-500 font-bold text-lg">
              ₡${Number(vehicle.price || 0).toLocaleString()}
            </span>
          </div>

          <div class="mt-4 flex items-center gap-3 text-sm text-zinc-400 flex-wrap">
            <span class="spec-pill">${vehicle.year || "N/D"}</span>
            <span class="spec-pill">${vehicle.brand || "N/D"}</span>
            <span class="spec-pill">${vehicle.model || "N/D"}</span>
          </div>

          <div class="mt-5">
            <button
              class="manageBtn w-full py-3 rounded-xl bg-zinc-800 hover:bg-red-600 transition font-semibold"
              data-id="${vehicle._id}">
              Administrar vehículo
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function addCardEvents() {
    const buttons = document.querySelectorAll(".manageBtn");

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;
        window.location.href = `./editVehicle.html?id=${id}`;
      });
    });
  }
});