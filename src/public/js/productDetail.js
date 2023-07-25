//VARIABLES
let parrWithId = document.getElementById("productId");
let productId = parrWithId.innerText;

//ELEMENTOS
let btnAddToCart = document.getElementById("btnAddToCart");
btnAddToCart.addEventListener("click", async () => {
  let cartExistente = localStorage.getItem("carritoId");
  if (!cartExistente) {
    let cartId = await crearCarrito();
    let result = await agregarProductoAlCarrito(cartId, productId);
    alert(result);
  } else {
    let result = await agregarProductoAlCarrito(cartExistente, productId);
    alert(result);
  }
});

let btnViewCart = document.getElementById("ViewCart");
btnViewCart.addEventListener("click", () => {
  let cartId = localStorage.getItem("carritoId");

  cartId
    ? (window.location.href = `http://localhost:8080/carts/${cartId}`)
    : alert("No tiene nada en el carrito, favor de agregar un producto.");
});

//Logout
let btnLogout = document.getElementById("logout-btn");
btnLogout.addEventListener("click", async () => {
  let result = await fetch("/api/sessions/logout", { method: "GET" });
  if (result.status === 200) {
    alert("Cerró sesion!");
    window.location.replace("/");
  } else {
    result = await result.json();
    alert(`${result.status}: ${result.error}`);
  }
});

//FUNCIONES
crearCarrito = async () => {
  try {
    let response = await fetch("http://localhost:8080/api/carts/", {
      method: "POST",
    });
    let res = await response.json();

    if (res.status === "Ok" || res.status === "OK") {
      localStorage.setItem("carritoId", res.data._id);
      return localStorage.getItem("carritoId");
    } else if (res.status === "errors") {
      alert(`Error: ${res.error}`);
    } else {
      alert(`Error: No fue posible crear el carrito`);
    }
  } catch (error) {
    alert(`Error al intentar agregar el carrito: ${error}`);
  }
};

agregarProductoAlCarrito = async (cartId, productId) => {
  try {
    let response = await fetch(
      `http://localhost:8080/api/carts/${cartId}/products/${productId}`,
      {
        method: "POST",
      }
    );
    let res = await response.json();

    if (res.status === "Ok" || res.status === "OK") {
      return `producto agregado al carrito id: ${cartId} `;
    } else if (res.status === "errors") {
      return `No fue posible agregar el producto al carrito: ${res.error}`;
    } else {
      return `Error: No fue posible agregar el producto al carrito`;
    }
  } catch (error) {
    alert(`Error al intentar agregar el carrito: ${error}`);
  }
};
