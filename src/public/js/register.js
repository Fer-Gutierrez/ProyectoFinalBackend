const form = document.getElementById("registerForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const userToRegister = {};
  data.forEach((value, key) => (userToRegister[key] = value));

  let result = await fetch("/api/sessions/register", {
    method: "POST",
    body: JSON.stringify(userToRegister),
    headers: { "Content-Type": "application/json" },
  });

  if (result.status !== 200) {
    result = await result.json();
    alert(`${result.errorCause}: ${result.message}`);
  }
  if (result.status === 200) {
    result = await result.json();
    alert(result.payload.message);
    window.location.href = "/login";
  }
});
