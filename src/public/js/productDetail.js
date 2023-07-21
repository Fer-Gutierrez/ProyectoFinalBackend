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
  console.log(cartId);
  cartId
    ? (window.location.href = `http://localhost:8080/carts/${cartId}`)
    : alert("No tiene nada en el carrito, favor de agregar un producto.");
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
      //   console.log(localStorage.getItem("carritoId"));
      return localStorage.getItem("carritoId");
    } else if (res.status === "errors") {
      alert(`Error: ${res.error}`);
    } else {
      alert(`Error: No fue posible crear el carrito`);
    }
  } catch (error) {
    console.log("Error al intentar agregar el carrito:", error);
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
    console.log("Error al intentar agregar el carrito:", error);
    alert(`Error al intentar agregar el carrito: ${error}`);
  }
};
