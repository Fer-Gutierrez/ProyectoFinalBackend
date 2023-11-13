let btnViewCart = document.getElementById("ViewCart");

btnViewCart.addEventListener("click", () => {
  let cartId = localStorage.getItem("carritoId");

  cartId
    ? (window.location.href = `/carts/${cartId}`)
    : alert("No tiene nada en el carrito, favor de agregar un producto.");
});
