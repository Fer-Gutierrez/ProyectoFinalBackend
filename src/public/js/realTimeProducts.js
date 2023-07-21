console.log("Se activo el socket del cliente -chat-");
const socket = io();

let btnViewCart = document.getElementById("ViewCart");
btnViewCart.addEventListener("click", () => {
  let cartId = localStorage.getItem("carritoId");
  console.log(cartId);
  cartId
    ? (window.location.href = `http://localhost:8080/carts/${cartId}`)
    : alert("No tiene nada en el carrito, favor de agregar un producto.");
});

//AddProducts
let addProductForm = document.getElementById("addProductForm");
addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //Convertimos el objeto en array:
  let imgArray = [];
  if (e.target.thumbnails.files.length > 0)
    imgArray = Array.prototype.slice.call(e.target.thumbnails.files);
  console.log(imgArray);

  //Configuramos la llamada:
  const formData = new FormData();
  formData.append("code", e.target.code.value);
  formData.append("title", e.target.title.value);
  formData.append("description", e.target.description.value);
  formData.append("price", e.target.price.value);
  formData.append("stock", e.target.stock.value);
  formData.append("status", e.target.status.value === "on" && "true");
  formData.append("category", e.target.category.value);
  formData.append("thumbnails", imgArray);

  const options = {
    method: "POST",
    body: formData,
  };

  fetch("http://localhost:8080/api/products/", options)
    .then((res) => res.json())
    .then((res) => {
      res.status === "OK"
        ? alert(res.message)
        : alert(JSON.stringify(res.error, null, "\t"));
    })
    .catch((err) => console.log("entrando", err));

  addProductForm.reset();
});

//DeleteProducts
let deleteProductForm = document.getElementById("deleteProductForm");
deleteProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(`http://localhost:8080/api/products/${e.target.id.value}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((res) => {
      res.status === "OK"
        ? alert(res.message)
        : alert(JSON.stringify(res.error, null, "\t"));
    })
    .catch((err) => console.log(err));
  deleteProductForm.reset();
});

//WebSocket
socket.on("refreshListProducts", (data) => {
  // console.log(data);
  const result = JSON.parse(data);

  let productsContenedor = document.getElementById("productsContenedor");
  productsContenedor.innerHTML = "";

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
    productsContenedor.append(divItemContenedor);
  });
});
