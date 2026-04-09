document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("publishVehicleForm");
  const clearFormBtn = document.getElementById("clearFormBtn");
  const formMessage = document.getElementById("formMessage");
  const imageInput = document.getElementById("image");
  const imagePreview = document.getElementById("imagePreview");

  const defaultCarImage = "../img/default-car.jpg";
  const token = sessionStorage.getItem("token");

  if (!token) {
    form.innerHTML = `
      <div class="md:col-span-2 text-center py-10">
        <p class="text-red-400 text-lg font-medium">Debes iniciar sesión para publicar un vehículo.</p>
      </div>
    `;
    return;
  }

  imageInput.addEventListener("change", showPreview);

  form.addEventListener("submit", submitForm);
  clearFormBtn.addEventListener("click", clearForm);

  function showPreview() {
    const file = imageInput.files[0];

    if (!file) {
      imagePreview.src = defaultCarImage;
      return;
    }

    imagePreview.src = URL.createObjectURL(file);
  }

  async function submitForm(event) {
    event.preventDefault();
    formMessage.textContent = "";

    const brand = document.getElementById("brand").value.trim();
    const model = document.getElementById("model").value.trim();
    const description = document.getElementById("description").value.trim();
    const year = document.getElementById("year").value.trim();
    const price = document.getElementById("price").value.trim();
    const status = "Disponible";
    const image = imageInput.files[0];

    if (!brand || !model || !description || !year || !price || !image) {
      formMessage.textContent = "Completa todos los campos.";
      return;
    }

    try {
      const userData = await getCurrentUser(token);
      const user = userData.user || userData;
      const id_user = user._id || user.id || "";

      if (!id_user) {
        formMessage.textContent = "No se pudo obtener el usuario.";
        return;
      }

      const formData = new FormData();
      formData.append("brand", brand);
      formData.append("model", model);
      formData.append("description", description);
      formData.append("year", year);
      formData.append("price", price);
      formData.append("status", status);
      formData.append("id_user", id_user);
      formData.append("image", image);

      await createVehicle(formData, token);

      formMessage.textContent = "Vehículo publicado correctamente.";
      form.reset();
      imagePreview.src = defaultCarImage;
    } catch (error) {
      formMessage.textContent = error.message;
    }
  }

  function clearForm() {
    form.reset();
    formMessage.textContent = "";
    imagePreview.src = defaultCarImage;
  }
});