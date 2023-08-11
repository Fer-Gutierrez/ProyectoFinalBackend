const form = document.getElementById("loginForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const infoLog = {};
  data.forEach((value, key) => (infoLog[key] = value));

  let result = await loginWithJWT(infoLog);

  if (result.status !== 200) {
    result = await result.json();
    alert(`${result.status}: ${result.error}`);
  }
  if (result.status === 200) {
    result = await result.json();
    alert(`Te damos la Bienvenida ${result.payload.name}!`);
    window.location.replace("/products");
  }
});

const loginWithSession = async (infoLog) => {
  let result = await fetch("/api/sessions/loginWithSession", {
    method: "POST",
    body: JSON.stringify(infoLog),
    headers: { "Content-Type": "application/json" },
  });
  return result;
};

const loginWithJWT = async (infoLog) => {
  let result = await fetch("/api/sessions/loginWithJWT", {
    method: "POST",
    body: JSON.stringify(infoLog),
    headers: { "Content-Type": "application/json" },
  });

  return result;
};
