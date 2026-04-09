document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editVehicleForm");
  const formMessage = document.getElementById("formMessage");
  const markSoldBtn = document.getElementById("markSoldBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const imagePreview = document.getElementById("imagePreview");

  const defaultCarImage = "../img/default-car.jpg";
  const token = sessionStorage.getItem("token");

  let vehicleId = "";
  let currentVehicle = null;

  loadVehicle();

  async function loadVehicle() {
    if (!token) {
      window.location.href = "./login.html";
      return;
    }

    const params = new URLSearchParams(window.location.search);
    vehicleId = params.get("id");

    if (!vehicleId) {
      formMessage.textContent = "No se encontró el vehículo.";
      return;
    }

    try {
      const data = await getVehicleById(vehicleId);
      currentVehicle = data.vehicle;
      fillForm(currentVehicle);
    } catch (error) {
      formMessage.textContent = error.message;
    }
  }

  function fillForm(vehicle) {
    document.getElementById("brand").value = vehicle.brand || "";
    document.getElementById("model").value = vehicle.model || "";
    document.getElementById("description").value = vehicle.description || "";
    document.getElementById("year").value = vehicle.year || "";
    document.getElementById("price").value = vehicle.price || "";
    document.getElementById("status").value = vehicle.status || "Disponible";

    if (vehicle.image_path) {
      imagePreview.src = "http://localhost:3000/" + vehicle.image_path;
    } else {
      imagePreview.src = defaultCarImage;
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formMessage.textContent = "";

    const brand = document.getElementById("brand").value.trim();
    const model = document.getElementById("model").value.trim();
    const description = document.getElementById("description").value.trim();
    const year = document.getElementById("year").value.trim();
    const price = document.getElementById("price").value.trim();
    const status = document.getElementById("status").value;

    if (!brand || !model || !description || !year || !price) {
      formMessage.textContent = "Completa todos los campos.";
      return;
    }

    try {
      const updateData = {
        id: vehicleId,
        brand,
        model,
        description,
        year: Number(year),
        price: Number(price),
        status
      };

      await updateVehicle(updateData, token);
      formMessage.textContent = "Vehículo actualizado correctamente.";
    } catch (error) {
      formMessage.textContent = error.message;
    }
  });

  markSoldBtn.addEventListener("click", async () => {
    formMessage.textContent = "";

    try {
      await updateVehicle({
        id: vehicleId,
        status: "Vendido"
      }, token);

      document.getElementById("status").value = "Vendido";
      formMessage.textContent = "Vehículo marcado como vendido.";
    } catch (error) {
      formMessage.textContent = error.message;
    }
  });

  deleteBtn.addEventListener("click", async () => {
    const confirmed = confirm("¿Deseas eliminar este vehículo?");
    if (!confirmed) {
      return;
    }

    formMessage.textContent = "";

    try {
      await deleteVehicle(vehicleId, token);
      window.location.href = "./myVehicles.html";
    } catch (error) {
      formMessage.textContent = error.message;
    }
  });
});