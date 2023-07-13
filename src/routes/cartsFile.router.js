import { Router } from "express";
import { Cart, CartFileManager } from "../dao/fileManager/cart.js";
import __dirname from "../utils.js";

const router = Router();
const cartFileManager = new CartFileManager(`${__dirname}/data/carts.json`);

router.post("/", async (req, res) => {
  let newCart = new Cart();
  let resultado = await cartFileManager.addCart(newCart);
  Object.keys(resultado).includes("error")
    ? res
        .status(404)
        .send({ status: "error", error: Object.values(resultado)[0] })
    : res.send({ status: "Ok", message: "Cart added", data: resultado });
});

router.get("/:cid", async (req, res) => {
  let cartId = req.params.cid;
  if (isNaN(cartId) || (!isNaN(cartId) && +cartId <= 0))
    res.status(400).send({
      status: "error",
      error: "Cart id property must be a positive number",
    });
  else {
    let cart = await cartFileManager.getCartById(+cartId);
    Object.keys(cart).includes("error")
      ? res.status(404).send({ status: "error", error: Object.values(cart)[0] })
      : res.send({ status: "Ok", data: cart });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  let cartId = req.params.cid;
  let productId = req.params.pid;

  if (isNaN(cartId) || (!isNaN(cartId) && +cartId <= 0))
    res.status(400).send({
      status: "error",
      error: "Cart id property must be a positive number",
    });
  else if (isNaN(productId) || (!isNaN(productId) && +productId <= 0))
    res.status(400).send({
      status: "error",
      error: "Product id property must be a positive number",
    });
  else {
    let resultado = await cartFileManager.addProductToCart(+cartId, +productId);
    Object.keys(resultado).includes("error")
      ? res
          .status(404)
          .send({ status: "error", error: Object.values(resultado)[0] })
      : res.send({
          status: "Ok",
          message: "The product was added to cart",
          data: resultado,
        });
  }
});

export default router;
