import { Router } from "express";
import __dirname from "../utils.js";
import CartDbManager from "../dao/dbManager/carts.js";
import ProductDbManager from "../dao/dbManager/products.js";

const router = Router();
const cartDbManager = new CartDbManager();
const productcDbManager = new ProductDbManager();

router.post("/", async (req, res) => {
  try {
    let resultado = await cartDbManager.addCart({ products: [] });
    Object.keys(resultado).includes("errors")
      ? res
          .status(400)
          .send({ status: "Bad Request", error: Object.values(resultado)[0] })
      : res.send({ status: "Ok", message: "Cart added", data: resultado });
  } catch (error) {
    res.status(500).send({ status: "Internal Server Error", error });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let cart = await cartDbManager.getCartById(cartId);

    if (!cart)
      return res
        .status(404)
        .send({ status: "Not Found", message: "cartId doesn't found" });

    Object.keys(cart).includes("errors")
      ? res
          .status(400)
          .send({ status: "Bad Request", error: Object.values(cart)[0] })
      : res.send({ status: "Ok", data: cart });
  } catch (error) {
    res.status(500).send({ status: "Internal Server Error", error });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;

    if (!(await cartDbManager.existCart(cartId)))
      return res.status(404).send({
        status: "Not Found",
        error: "CartId doesn't exist",
      });

    if (!(await productcDbManager.existProduct(productId)))
      return res.status(404).send({
        status: "Not Found",
        error: "ProductId doesn't exist",
      });

    let resultado = await cartDbManager.addProductToCart(cartId, productId);
    Object.keys(resultado).includes("errors")
      ? res
          .status(400)
          .send({ status: "Bad Request", error: Object.values(resultado)[0] })
      : res.send({
          status: "Ok",
          message: "The product was added to cart",
          data: resultado,
        });
  } catch (error) {
    res.status(500).send({ status: "Internal Server Error", error });
  }
});

export default router;
