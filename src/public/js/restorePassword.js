const formRestore = document.getElementById("formRestorePass");
formRestore.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(e.target.userId.value);
  console.log(e.target.token.value);
  const infoRestore = {
    newPassword: e.target.newPassword.value,
    confirmPassword: e.target.confirmPassword.value,
    userId: e.target.userId.value,
  };
  console.log(infoRestore);
  let result = await fetch("/api/users/restorePassword", {
    method: "POST",
    body: JSON.stringify(infoRestore),
    headers: { "Content-Type": "application/json" },
  });
  let res = await result.json();

  if (result.status !== 200) {
    alert(`${res.errorCause}: ${res.message}`);
  }
  if (result.status === 200) {
    console.log(res);
    alert(
      `Contraseña actualizada con exito.`
    );
    window.location.replace("/login");
  }
});
