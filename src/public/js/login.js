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
  let res = await result.json();

  console.log(result.status);
  if (result.status !== 200) {
    console.log("estamos");
    alert(`${res.errorCause}: ${res.message}`);
  }
  if (result.status === 200) {
    alert(
      `Te damos la Bienvenida ${res.payload.first_name} ${res.payload.first_name}!`
    );
    window.location.replace("/products");
  }
});
