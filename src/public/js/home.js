const baseUrl = window.location.origin;

const obtenerDatos = async () => {
  let result = await fetch(`${baseUrl}/api/products/`).then((res) =>
    res.json()
  );

  result.payload.data.forEach((p) => {
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

  cartId
    ? (window.location.href = `${baseUrl}/carts/${cartId}`)
    : alert("No tiene nada en el carrito, favor de agregar un producto.");
});
