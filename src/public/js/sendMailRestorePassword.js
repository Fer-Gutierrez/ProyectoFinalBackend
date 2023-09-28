const formRestorePass = document.getElementById("form-restorePass");

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