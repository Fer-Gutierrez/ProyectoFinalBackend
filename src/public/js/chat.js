const socket = io();

//FUNCIONES
//VALIDAMOS EXISTENCIA DE USUARIO:
let user;
const validarUsuario = async () => {
  try {
    let result = await fetch("/api/sessions/current");

    if (result.status === 200) {
      let data = await result.json();
      user = data.user.email;
    } else {
      user = prompt("Ingrese su correo");
      while (user === "" || !emailRegex.test(user)) {
        if (user !== "") {
          alert("El email no es valido");
          user = "";
        }
        user = prompt("Ingrese su correo");
      }

      if (!user || !emailRegex.test(user)) {
        let container = document.getElementById("container");
        container.innerHTML = "";
        let titleFinal = document.createElement("h1");
        titleFinal.innerText =
          "Favor de refrescar la página y colocar su correo.";
        container.append(titleFinal);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
validarUsuario();

//Btn-verCarrito
let btnViewCart = document.getElementById("ViewCart");
btnViewCart.addEventListener("click", () => {
  let cartId = localStorage.getItem("carritoId");

  cartId
    ? (window.location.href = `http://localhost:8080/carts/${cartId}`)
    : alert("No tiene nada en el carrito, favor de agregar un producto.");
});

let form = document.getElementById("messageForm");
let divMessages = document.getElementById("messageContainer");
let messageInput = document.getElementById("messageInput");
emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

//ESCRIBIENDO EL MENSAJE:
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let messageToSend = {
    user: user,
    message: messageInput.value,
  };

  //ENVIO EL MENSAJE:
  socket.emit("chatMessage", JSON.stringify(messageToSend, null, "\t"));
  form.reset();
});

//ESCUCHO LOS MENSAJES:
socket.on("chatMessage", (data) => {
  message = JSON.parse(data);
  let msgContainer = document.createElement("div");
  msgContainer.classList.add("msgContainer");

  let p1 = document.createElement("p");
  p1.classList.add("user");
  message.user === user
    ? (p1.innerText = "Tu:")
    : (p1.innerText = `${message.user}:`);
  let p2 = document.createElement("p");
  p2.classList.add("message");
  p2.innerText = `${message.message}`;

  msgContainer.append(p1);
  msgContainer.append(p2);
  message.user === user
    ? msgContainer.classList.add("right")
    : msgContainer.classList.add("left");
  divMessages.append(msgContainer);

  //SCROLLEAMOS AL FINAL
  divMessages.scrollTop = divMessages.scrollHeight;
});
