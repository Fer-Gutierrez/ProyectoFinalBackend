const obtenerDatos = async () => {
  let result = await fetch("http://localhost:8080/api/products/")
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((res) => {
      return res.products;
    });

  result.forEach((p) => {
    let divItemContenedor = document.createElement("div");
    divItemContenedor.className = "itemContenedor";
    let tituloItem = document.createElement("strong");
    tituloItem.className = "tituloItem";
    tituloItem.innerText = `${p._id} - ${p.code} - ${p.title}:`;
    let datosItem = document.createElement("p");
    datosItem.className = "datosItem";
    datosItem.innerText = `
      Descripción: ${p.description}
      Precio: ${p.price}
      Estado: ${p.status}
      Stock: ${p.stock}
      Categoría: ${p.category}
      `;
    divItemContenedor.append(tituloItem);
    divItemContenedor.append(datosItem);
    document.body.append(divItemContenedor);
  });
};

obtenerDatos();

let btnViewCart = document.getElementById("ViewCart");
btnViewCart.addEventListener("click", () => {
  let cartId = localStorage.getItem("carritoId");
  console.log(cartId);
  cartId
    ? (window.location.href = `http://localhost:8080/carts/${cartId}`)
    : alert("No tiene nada en el carrito, favor de agregar un producto.");
});