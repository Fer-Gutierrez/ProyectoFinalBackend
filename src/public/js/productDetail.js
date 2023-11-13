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
    ? (window.location.href = `/carts/${cartId}`)
    : alert("No tiene nada en el carrito, favor de agregar un producto.");
});

//FUNCIONES
crearCarrito = async () => {
  try {
    let response = await fetch(`/api/carts/`, {
      method: "POST",
    });
    let res = await response.json();

    if (response.status === 200) {
      console.log(res);
      localStorage.setItem("carritoId", res.payload.data._id);
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
      `/api/carts/${cartId}/products/${productId}`,
      {
        method: "POST",
      }
    );
    let res = await response.json();

    if (response.status === 200) {
      return `producto agregado al carrito id: ${cartId} `;
    } else if (response.status !== 200) {
      return `No fue posible agregar el producto al carrito: ${res.error.message}`;
    } else {
      return `Error: No fue posible agregar el producto al carrito`;
    }
  } catch (error) {
    alert(`Error al intentar agregar el carrito: ${error}`);
  }
};
