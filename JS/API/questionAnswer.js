const GRAPH_API = "http://localhost:4000/graphql";
const QUESTION_API = "http://localhost:3000/api/question";
const ANSWER_API = "http://localhost:3000/api/answer";

async function getQuestionsByVehicle(id, token) {
  const response = await fetch(GRAPH_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `query GetQuestionsByVehicle($id_vehicle: ID!) {
        questionsByVehicle(id_vehicle: $id_vehicle) {
          id
          message
          created_at
          user {
            id
            name
            last_name
          }
          answer {
            id
            message
            created_at
            user {
              id
              name
              last_name
            }
          }
        }
      }`,
      variables: { id_vehicle: id }
    })
  });

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(errors[0].message || "No se pudieron cargar las conversaciones.");
  }

  return data.questionsByVehicle;
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
  const response = await fetch(GRAPH_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `query GetAnswersByQuestion($id_question: ID!) {
        answersByQuestion(id_question: $id_question) {
          id
          message
          created_at
          user {
            id
            name
            last_name
          }
        }
      }`,
      variables: { id_question: id }
    })
  });

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(errors[0].message || "No se pudieron cargar las respuestas.");
  }

  return data.answersByQuestion;
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
