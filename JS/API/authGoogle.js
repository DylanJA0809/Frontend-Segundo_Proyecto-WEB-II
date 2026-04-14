const API = "http://localhost:3000";

async function loginWithGoogle(credential) {
  const res = await fetch(`${API}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ credential })
  });
  
  return res.json();

}

async function completeProfile(data, token) {
  const res = await fetch(`${API}/auth/complete-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
}