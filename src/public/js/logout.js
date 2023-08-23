const btnLogout = document.getElementById("logout-btn");
btnLogout &&
  btnLogout.addEventListener("click", async () => {
    let result = await fetch("/api/sessions/logout", { method: "GET" });
    console.log(result);
    if (result.status === 200) {
      alert("Cerró sesion!");
      window.location.replace("/");
    } else {
      result = await result.json();
      console.log(result);
      alert(`${result.status}: ${result.error.message}`);
    }
  });
