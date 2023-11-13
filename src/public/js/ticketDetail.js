let btnViewCart = document.getElementById("ViewCart");
const baseUrl = window.location.origin;

btnViewCart.addEventListener("click", () => {
  let cartId = localStorage.getItem("carritoId");

  cartId
    ? (window.location.href = `${baseUrl}/carts/${cartId}`)
    : alert("No tiene nada en el carrito, favor de agregar un producto.");
});
