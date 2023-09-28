const form = document.getElementById("loginForm");
const btnRestorePass = document.getElementById("btn-restorePass");
const formRestorePass = document.getElementById("form-restorePass");

btnRestorePass.addEventListener("click", () => {
  if (formRestorePass.className === "invisible")
    formRestorePass.className = "visible";
});

formRestorePass.addEventListener("submit", async (e) => {
  e.preventDefault();
  const infoLog = { email: e.target.email.value };

  let result = await fetch("/api/users/sendRestoreMail", {
    method: "POST",
    body: JSON.stringify(infoLog),
    headers: { "Content-Type": "application/json" },
  });
  let res = await result.json();

  if (result.status !== 200) {
    console.log("estamos");
    alert(`${res.errorCause}: ${res.message}`);
  }
  if (result.status === 200) {
    alert(
      `Correo enviado. Revisa tu casilla y dirigete al link para restaurar tu contraseña.`
    );
    window.location.replace("/products");
  }
});

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
