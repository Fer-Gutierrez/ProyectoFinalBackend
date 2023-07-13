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

// let addProductForm = document.getElementById("addProductForm");
// addProductForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   //Convertimos el objeto en array:
//   let imgArray = [];
//   if (e.target.thumbnails.files.length > 0)
//     imgArray = Array.prototype.slice.call(e.target.thumbnails.files);
//   console.log(imgArray);

//   //Configuramos la llamada:
//   const formData = new FormData();
//   formData.append("code", e.target.code.value);
//   formData.append("title", e.target.title.value);
//   formData.append("description", e.target.description.value);
//   formData.append("price", e.target.price.value);
//   formData.append("stock", e.target.stock.value);
//   formData.append("status", e.target.status.value === "on" && "true");
//   formData.append("category", e.target.category.value);
//   formData.append("thumbnails", imgArray);

//   const options = {
//     method: "POST",
//     body: formData,
//   };

//   fetch("http://localhost:8080/api/products/", options)
//     .then((res) => res.json())
//     .then((res) => {
//       console.log(res);
//       res.status === "OK" ? alert(res.message) : alert(res.error);
//     })
//     .catch((err) => console.log(err));

//   addProductForm.reset();
// });

// let deleteProductForm = document.getElementById("deleteProductForm");
// deleteProductForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   fetch(`http://localhost:8080/api/products/${e.target.id.value}`, {
//     method: "DELETE",
//   })
//     .then((res) => res.json())
//     .then((res) => {
//       console.log(res);
//       res.status === "OK" ? alert(res.message) : alert(res.error);
//     })
//     .catch((err) => console.log(err));
//   deleteProductForm.reset();
// });
