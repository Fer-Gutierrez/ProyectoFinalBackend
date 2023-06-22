console.log("Se activo el socket del cliente -chat-");
const socket = io();

socket.on("refreshListProducts", (data) => {
  console.log(data);
  const result = JSON.parse(data);

  let productsContenedor = document.getElementById("productsContenedor");
  productsContenedor.innerHTML = "";

  result.forEach((p) => {
    let divItemContenedor = document.createElement("div");
    divItemContenedor.className = "itemContenedor";
    let tituloItem = document.createElement("strong");
    tituloItem.className = "tituloItem";
    tituloItem.innerText = `${p.id} - ${p.code} - ${p.title}:`;
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
