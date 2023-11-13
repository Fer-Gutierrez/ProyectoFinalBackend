//VARIABLES
let urlFiltro = "";
let urlNextPage = "";
let urlPrevPage = "";
const baseUrl = window.location.origin;

//FUNCIONES
realizarConsulta = async (url) => {
  try {
    let response = await fetch(url, { method: "GET" }).then((res) =>
      res.json()
    );
    if (response.status === "success") {
      actualizarDatosEnPantalle(response.payload);
    } else if (response.status === "error") {
      alert(`Error: ${response.error}`);
    } else {
      alert(`Error: La consulta no fue existosa`);
    }
  } catch (error) {
    alert(`Error al intentar consultar los datos: ${error}`);
  }
};

actualizarDatosEnPantalle = (payload) => {
  let btnAnterior = document.getElementById("btnAnterior");
  let btnSiguiente = document.getElementById("btnSiguiente");
  if (payload.hasPrevPage) {
    btnAnterior.disabled = false;
    urlPrevPage = payload.prevLink;
  } else {
    btnAnterior.disabled = true;
    urlPrevPage = "";
  }

  if (payload.hasNextPage) {
    btnSiguiente.disabled = false;
    urlNextPage = payload.nextLink;
  } else {
    btnSiguiente.disabled = true;
    urlNextPage = "";
  }

  let page = document.getElementById("pageNumber");
  page.innerText = payload.page;

  let totalRecords = document.getElementById("totalRecords");
  totalRecords.innerText = payload.totalRecords;

  let totalPages = document.getElementById("totalPages");
  totalPages.innerText = payload.totalPages;

  let panelDatos = document.getElementById("panelDatos");
  panelDatos.innerHTML = "";
  if (payload.data.length <= 0) {
    let parrInfo = document.createElement("p");
    parrInfo.innerText = "Ningun producto con el filtro aplicado";
    panelDatos.append(parrInfo);
  } else {
    payload.data.forEach((p) => {
      let div = document.createElement("div");
      div.className = "itemContenedor";
      div.innerHTML = `
          <div style="display: flex; flex-direction:row; gap: .5rem;">
              <strong>Id: </strong><p Id="productId">${p._id}</p>
              <strong>Code: </strong><p>${p.code}</p>
              <strong>Title: </strong><p>${p.title}</p>
          </div>
          <div style="display: flex; flex-direction:row; gap: .5rem;">
              <strong>Category: </strong><p>${p.category}</p>
          </div>
          <div style="display: flex; flex-direction:row; gap: .5rem;">
              <strong>Description: </strong><p>${p.description}</p>
          </div>
          <div style="display: flex; flex-direction:row; gap: .5rem;">
              <strong>Status: </strong><p>${p.status}</p>
          </div>
          <div style="display: flex; flex-direction:row; gap: .5rem;">
              <strong>Price: </strong><p>${p.price}</p>
          </div>
          <div style="display: flex; flex-direction:row; gap: .5rem;">
              <strong>Stock: </strong><p>${p.stock}</p>
          </div>
          <a href="${baseUrl}/product/${p._id}"><button>Ver Detalle</button></a>
        `;

      let productId = p._id;
      let btnAddToCart = document.createElement("button");
      btnAddToCart.innerText = "Agregar al carrito";
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
      div.append(btnAddToCart);
      panelDatos.append(div);
    });
  }
};

limpiarPanelDatos = () => {
  let panelDatos = document.getElementById("panelDatos");
  panelDatos.innerHTML = "";
};

crearCarrito = async () => {
  try {
    // let response = await fetch("http://localhost:8080/api/carts/", {
    let response = await fetch(`${baseUrl}/api/carts/`, {
      method: "POST",
    });
    let res = await response.json();

    if (response.status === 200) {
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
      // `http://localhost:8080/api/carts/${cartId}/products/${productId}`,
      `${baseUrl}/api/carts/${cartId}/products/${productId}`,
      {
        method: "POST",
      }
    );
    let res = await response.json();
    if (response.status === 200) {
      return `producto agregado al carrito id: ${cartId} `;
    } else {
      return `Error: No fue posible agregar el producto al carrito: ${res.message}`;
    }
  } catch (error) {
    alert(`Error al intentar agregar el carrito: ${error}`);
  }
};

//ELEMENTOS
//aplicar filtros:
let formFilter = document.getElementById("formFiltro");
formFilter.addEventListener("submit", (e) => {
  e.preventDefault();

  let code = e.target.code.value;
  let title = e.target.title.value;
  let description = e.target.description.value;
  let category = e.target.category.value;
  let status = e.target.status.value;
  let price = e.target.price.value;
  let stock = e.target.stock.value;
  let limit = e.target.limit.value || 10;

  let query = {
    code,
    title,
    description,
    category,
    status,
    price,
    stock,
    limit,
  };

  // urlFiltro = `http://localhost:8080/api/products?code=${query.code}&title=${query.title}&description=${query.description}&category=${query.category}&status=${query.status}&price=${query.price}&stock=${query.stock}&limit=${limit}`;
  urlFiltro = `${baseUrl}/api/products?code=${query.code}&title=${query.title}&description=${query.description}&category=${query.category}&status=${query.status}&price=${query.price}&stock=${query.stock}&limit=${limit}`;

  realizarConsulta(urlFiltro);
});

let btnAnterior = document.getElementById("btnAnterior");
btnAnterior.addEventListener("click", () => {
  realizarConsulta(urlPrevPage);
});

let btnSiguiente = document.getElementById("btnSiguiente");
btnSiguiente.addEventListener("click", () => {
  realizarConsulta(urlNextPage);
});

let btnViewCart = document.getElementById("ViewCart");
btnViewCart.addEventListener("click", () => {
  let cartId = localStorage.getItem("carritoId");
  cartId
    ? // ? (window.location.href = `http://localhost:8080/carts/${cartId}`)
      (window.location.href = `${baseUrl}/carts/${cartId}`)
    : alert("No tiene nada en el carrito, favor de agregar un producto.");
});
