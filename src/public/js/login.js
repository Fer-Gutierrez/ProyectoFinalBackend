const form = document.getElementById("loginForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const infoLog = {};
  data.forEach((value, key) => (infoLog[key] = value));

  let result = await fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(infoLog),
    headers: { "Content-Type": "application/json" },
  });


  if (result.status !== 200) {
    result = await result.json();
    alert(`${result.status}: ${result.error.message}`);
  }
  if (result.status === 200) {
    result = await result.json();
    alert(`Te damos la Bienvenida ${result.payload.first_name} ${result.payload.first_name}!`);
    window.location.replace("/products");
  }
});
