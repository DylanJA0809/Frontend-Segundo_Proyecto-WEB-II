const QUESTION_API = "http://localhost:3000/api/question";
const ANSWER_API = "http://localhost:3000/api/answer";

async function getQuestionsByVehicle(id, token) {
  const res = await fetch(`${QUESTION_API}?id_vehicle=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json().catch(() => ([]));

  if (!res.ok) {
    throw new Error("No se pudieron cargar las conversaciones.");
  }

  return data;
}

async function createQuestion(data, token) {
  const res = await fetch(QUESTION_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    if (res.status === 409) {
      throw new Error("Debes esperar a que respondan tu pregunta actual antes de volver a preguntar.");
    }

    throw new Error("No se pudo enviar la pregunta.");
  }

  return await res.json();
}

async function getAnswersByQuestion(id, token) {
  const res = await fetch(`${ANSWER_API}?id_question=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json().catch(() => ([]));

  if (!res.ok) {
    throw new Error("No se pudieron cargar las respuestas.");
  }

  return data;
}

async function createAnswer(data, token) {
  const res = await fetch(ANSWER_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    if (res.status === 409) {
      throw new Error("Esta pregunta ya fue respondida.");
    }

    throw new Error("No se pudo enviar la respuesta.");
  }

  return await res.json();
}