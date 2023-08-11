let btnLogout = document.getElementById("logout-btn");
btnLogout.addEventListener("click", async () => {
  let result = await logoutWithJWT();
  if (result.status === 200) {
    alert("Cerró sesion!");
    window.location.replace("/");
  } else {
    result = await result.json();
    alert(`${result.status}: ${result.error}`);
  }

  // let result = await fetch("/api/sessions/logoutWithJWT", { method: "GET" });
  // if (result.status === 200) {
  //   alert("Cerró sesion!");
  //   window.location.replace("/");
  // } else {
  //   result = await result.json();
  //   alert(`${result.status}: ${result.error}`);
  // }
});

const logoutWithJWT = async () =>{
    let result = await fetch("/api/sessions/logoutWithJWT", { method: "GET" });
    return result;
}

const logoutWithSession = async () =>{
    let result = await fetch("/api/sessions/logoutWithSession", { method: "GET" });
    return result;
}