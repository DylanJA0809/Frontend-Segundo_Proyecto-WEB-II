const APIbaseUrl = "http://localhost:3000";

async function loginUser(email, password) {
  const response = await fetch(APIbaseUrl + "/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Falló al inciar sesión, intente de nuevo");
  }

  return data; 
}

async function registerUser(userData) {
  const response = await fetch(APIbaseUrl + "/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Falló al registrarse, intente de nuevo");
  }

  return data;
}