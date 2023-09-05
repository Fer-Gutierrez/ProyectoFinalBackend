let purchaseCart_btn = document.getElementById("purchaseCart");
let strongWithCartId = document.getElementById("cartid");
let cartId = strongWithCartId.innerText;
purchaseCart_btn.addEventListener("click", async () => {
  let response = await fetch(
    `http://localhost:8080/api/carts/${cartId}/purchase`,
    { method: "POST" }
  );
  let res = await response.json();
  console.log(res);
  if (response.status !== 200) {
    alert(res.error.message);
  } else {
    console.log(res.payload?.data?.productsWithoutStock.length);
    alert(`Result: ${res.payload.message}.-
      - ${res.payload?.data?.productsCompleted.length} Products was added to: ${res.payload?.data?.ticket?.code}.
      - ${res.payload?.data?.productsWithoutStock.length} Products dont have stock`);

    //Si tenemos productos sin stock los actualizamos al carrito:
    if (res.payload?.data?.productsWithoutStock.length > 0) {
      const arrayProducts = res.payload?.data?.productsWithoutStock.map((p) => {
        return { product: p.product._id, quantity: p.quantity };
      });
      console.log(arrayProducts);
      let resultUpdate = await fetch(
        `http://localhost:8080/api/carts/${cartId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Indica que estás enviando JSON en el cuerpo
          },
          body: JSON.stringify(arrayProducts),
        }
      );
      let resUpdate = await resultUpdate.json();
      if (resultUpdate.status !== 200) {
        alert(resUpdate.error.message);
      } else {
        //window.location.replace(`/carts/${cartId}`);
      }
    } else {
      localStorage.removeItem("carritoId");
      alert(
        `Todos los productos del carrito fueron guardados en el ${res.payload?.data?.ticket.code}`
      );
    }
    console.log(res.payload?.data?.ticket);
    if (res.payload?.data?.ticket) {
      window.location.replace(`/ticket/${res.payload?.data?.ticket._id}`);
    }
  }
});
