document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("vehicleDetailsContainer");
  const defaultCarImage = "../img/default-car.png";
  const token = sessionStorage.getItem("token");
  let currentVehicle = null;
  let currentUser = null;

  loadVehicleDetails();

  async function loadVehicleDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      showError("No se encontró el vehículo.");
      return;
    }

    try {
      const vehicle = await getVehicleById(id);
      const owner = vehicle.owner;

      showVehicle(vehicle, owner);

      currentVehicle = vehicle;

      if (token) {
        const userData = await getCurrentUser(token);
        currentUser = userData;

        loadQuestions(vehicle.id);
      } else {
        showQuestionLoginMessage();
      }

    } catch (error) {
      showError(error.message);
    }
  }

  function showError(message) {
    container.innerHTML = `
      <div class="col-span-full text-center py-16">
        <p class="text-red-400 text-lg font-medium">${message}</p>
      </div>
    `;
  }

  function showVehicle(vehicle, owner) {
    let image = defaultCarImage;

    if (vehicle.image_path) {
      image = "http://localhost:3000/" + vehicle.image_path;
    }

    let statusClass = "disponible";

    if (vehicle.status === "Vendido") {
      statusClass = "vendido";
    }

    const ownerSection = buildOwnerSection(owner);

    let actionButtons = `
      <button id="copyLinkBtn"
        class="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition font-semibold">
        Copiar enlace
      </button>
    `;

    const shareUrl = window.location.href;

    container.innerHTML = `
      <section class="detail-card fade-in">
        <img
          src="${image}"
          alt="${vehicle.brand} ${vehicle.model}"
          class="detail-image"
          onerror="this.onerror=null; this.src='${defaultCarImage}'"
        />
      </section>

      <section class="detail-card fade-in p-6 lg:p-8">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 class="text-3xl font-bold text-white">${vehicle.brand} ${vehicle.model}</h2>
            <p class="text-zinc-400 mt-2">Información completa del vehículo publicado en TicoAutos</p>
          </div>

          <span class="status-badge ${statusClass}">
            ${vehicle.status || "Disponible"}
          </span>
        </div>

        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="info-box">
            <p class="label-small">Marca</p>
            <p class="value-strong">${vehicle.brand || "No disponible"}</p>
          </div>

          <div class="info-box">
            <p class="label-small">Modelo</p>
            <p class="value-strong">${vehicle.model || "No disponible"}</p>
          </div>

          <div class="info-box">
            <p class="label-small">Año</p>
            <p class="value-strong">${vehicle.year || "No disponible"}</p>
          </div>

          <div class="info-box">
            <p class="label-small">Precio</p>
            <p class="value-strong">₡${Number(vehicle.price || 0).toLocaleString()}</p>
          </div>

          <div class="info-box sm:col-span-2">
            <p class="label-small">Descripción</p>
            <p class="value-strong">${vehicle.description || "Sin descripción"}</p>
          </div>

          ${ownerSection}
        </div>

        <div class="mt-8">
          <p class="text-sm text-zinc-400 mb-2">Compartir vehículo</p>

          <div class="mt-4 flex flex-col sm:flex-row gap-3">
            ${actionButtons}
          </div>

          <p id="actionMessage" class="text-sm text-zinc-400 mt-3"></p>
        </div>
      </section>
    `;

    copyButton(shareUrl);
  }

  function buildOwnerSection(owner) {
    if (!owner) {
      return `
        <div class="info-box sm:col-span-2">
          <p class="label-small">Propietario</p>
          <p class="value-strong">Información no disponible</p>
        </div>
      `;
    }

    // user sin aunticar
    if (!token) {
      return `
        <div class="info-box sm:col-span-2">
          <p class="label-small">Propietario</p>
          <p class="value-strong">${owner.name || ""} ${owner.last_name || ""}</p>
        </div>
      `;
    }

    // user autenticado
    return `
      <div class="info-box">
        <p class="label-small">Nombre</p>
        <p class="value-strong">${owner.name || "No disponible"}</p>
      </div>

      <div class="info-box">
        <p class="label-small">Apellido</p>
        <p class="value-strong">${owner.last_name || "No disponible"}</p>
      </div>

      <div class="info-box">
        <p class="label-small">Correo</p>
        <p class="value-strong">${owner.email || "No disponible"}</p>
      </div>

      <div class="info-box">
        <p class="label-small">Cédula</p>
        <p class="value-strong">${owner.id_number || "No disponible"}</p>
      </div>
    `;
  }

  function copyButton(link) {
    const copyBtn = document.getElementById("copyLinkBtn");
    const actionMessage = document.getElementById("actionMessage");

    if (!copyBtn) {
      return;
    }

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(link);
        actionMessage.textContent = "Enlace copiado correctamente.";
      } catch (error) {
        actionMessage.textContent = "No se pudo copiar el enlace.";
      }
    });
  }

  async function loadQuestions(vehicleId) {
    const container = document.getElementById("questionsContainer");
    const questionForm = document.getElementById("questionFormContainer");
    const questionMessage = document.getElementById("questionMessage");

    if (!token) {
      showQuestionLoginMessage();
      return;
    }

    try {
      const questions = await getQuestionsByVehicle(vehicleId, token);

      let html = "";
      let hasPendingQuestion = false;

      for (const q of questions) {
        const answers = await getAnswersByQuestion(q.id, token);
        const askerName = getFullName(q.user);

        if (!isOwner() && answers.length === 0) {
          hasPendingQuestion = true;
        }

        html += `
          <div class="question-box">
            <p class="text-sm text-zinc-400">${askerName}</p>
            <p class="text-white">${q.message}</p>

            ${answers.map(a => `
              <div class="answer-box">
                <p class="text-sm text-zinc-400">${getFullName(a.user)}</p>
                <p class="text-white">${a.message}</p>
              </div>
            `).join("")}

            ${isOwner() && answers.length === 0 ? `
              <textarea
                data-id="${q.id}"
                class="answerInput w-full mt-3 bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-white"
                placeholder="Responder..."></textarea>

              <button
                data-id="${q.id}"
                class="sendAnswerBtn mt-2 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-xl font-semibold">
                Responder
              </button>
            ` : ""}
          </div>
        `;
      }

      if (!html) {
        container.innerHTML = `
          <p class="text-zinc-400">
            ${isOwner() ? "No hay conversaciones todavía." : "No has realizado preguntas sobre este vehículo."}
          </p>
        `;
      } else {
        container.innerHTML = html;
      }

      if (isOwner()) {
        questionForm.classList.add("hidden");
        questionMessage.textContent = "";
      } else {
        if (hasPendingQuestion) {
          questionForm.classList.add("hidden");
          questionMessage.textContent = "Debes esperar a que respondan tu pregunta actual antes de volver a preguntar.";
        } else {
          questionForm.classList.remove("hidden");
          questionMessage.textContent = "";
        }
      }

      attachAnswerEvents();

    } catch (err) {
      container.innerHTML = `<p class="text-red-400">${err.message}</p>`;
    }
  }

  document.addEventListener("click", async (e) => {
    if (e.target.id === "sendQuestionBtn") {
      const input = document.getElementById("questionInput");
      const message = input.value.trim();
      const questionMessage = document.getElementById("questionMessage");

      if (!message) {
        return;
      }

      try {
        await createQuestion({
          id_vehicle: currentVehicle.id,
          message
        }, token);

        input.value = "";
        questionMessage.textContent = "";
        questionMessage.classList.remove("text-red-400");
        loadQuestions(currentVehicle.id);

      } catch (err) {
        questionMessage.textContent = err.message;
        questionMessage.classList.add("text-red-400");
      }
    }
  });

  function attachAnswerEvents() {
    const buttons = document.querySelectorAll(".sendAnswerBtn");
    const questionMessage = document.getElementById("questionMessage");

    buttons.forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const input = document.querySelector(`.answerInput[data-id="${id}"]`);
        const message = input.value.trim();

        if (!message) {
          return;
        }

        try {
          await createAnswer({
            id_question: id,
            message
          }, token);

          questionMessage.textContent = "";
          questionMessage.classList.remove("text-red-400");
          loadQuestions(currentVehicle.id);

        } catch (err) {
          questionMessage.textContent = err.message;
          questionMessage.classList.add("text-red-400");
        }
      });
    });
  }

  async function getCurrentUser(token) {
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: `query { me { id name last_name email id_number } }`
      })
    });

    const { data, errors } = await response.json();
    if (errors) throw new Error("No se pudo obtener el usuario");
    return data.me;
  }

  function getFullName(user) {
    if (!user) {
      return "Usuario";
    }

    const name = user.name || "";
    const lastName = user.last_name || "";

    const fullName = `${name} ${lastName}`.trim();

    return fullName || "Usuario";
  }

  function isOwner() {
    if (!currentUser || !currentVehicle) return false;

    const ownerId = currentVehicle.owner?.id
    return String(ownerId) === String(currentUser.id);
  }

  function showQuestionLoginMessage() {
    const container = document.getElementById("questionsContainer");
    const message = document.getElementById("questionMessage");
    const form = document.getElementById("questionFormContainer");

    if (form) {
      form.classList.add("hidden");
    }

    if (container) {
      container.innerHTML = `
        <p class="text-zinc-400">
          Inicia sesión para ver tus conversaciones y realizar preguntas sobre este vehículo.
        </p>
      `;
    }

    if (message) {
      message.textContent = "";
    }
  }
});