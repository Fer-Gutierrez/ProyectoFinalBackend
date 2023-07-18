import { Router } from "express";
import __dirname from "../utils.js";
import CartDbManager from "../dao/dbManager/carts.js";
import ProductDbManager from "../dao/dbManager/products.js";

const router = Router();
const cartDbManager = new CartDbManager();
const productcDbManager = new ProductDbManager();

router.get("/", async (req, res) => {
  try {
    let carts = await cartDbManager.getCarts();

    Object.keys(carts).includes("errors")
      ? res
          .status(400)
          .send({ status: "Bad Request", error: Object.values(carts)[0] })
      : res.send({ status: "Ok", data: carts });
  } catch (error) {
    res.status(500).send({ status: "Internal Server Error", error });
  }
});

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

    let existCart = await cartDbManager.existCart(cartId);
    if (!existCart || existCart.reason)
      return res
        .status(404)
        .send({ status: "Not Found", message: "cartId doesn't found" });

    let cart = await cartDbManager.getCartById(cartId);

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

    let existCart = await cartDbManager.existCart(cartId);
    if (!existCart || existCart.reason)
      return res.status(404).send({
        status: "Not Found",
        error: "CartId doesn't exist",
      });

    let existProduct = await productcDbManager.existProduct(productId);
    if (!existProduct || existProduct.reason)
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

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;

    let existCart = await cartDbManager.existCart(cartId);
    if (!existCart || existCart.reason)
      return res.status(404).send({
        status: "Not Found",
        error: "CartId doesn't exist",
      });

    let existProduct = await cartDbManager.existProductInCart(
      cartId,
      productId
    );
    if (!existProduct || existProduct.reason)
      return res.status(404).send({
        status: "Not Found",
        error: `ProductId doesn't existe in CartId (${cartId})`,
      });

    let result = await cartDbManager.deleteProductInCart(cartId, productId);
    Object.keys(result).includes("errors")
      ? res
          .status(400)
          .send({ status: "Bad Request", error: Object.values(result)[0] })
      : res.send({
          status: "Ok",
          message: `The product was removed from the cart (${cartId})`,
          data: result,
        });
  } catch (error) {
    res.status(500).send({ status: "Internal Server Error", error });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let arrayOfIdProducts = req.body;

    let existCart = await cartDbManager.existCart(cartId);
    if (!existCart || existCart.reason)
      return res.status(404).send({
        status: "Not Found",
        error: "CartId doesn't exist",
      });

    if (!Array.isArray(arrayOfIdProducts))
      return res.status(400).send({
        status: "Bad Request",
        error: "The param Body must be a Array object.",
      });

    let result = await cartDbManager.updateProductsInCart(
      cartId,
      arrayOfIdProducts
    );
    Object.keys(result).includes("errors")
      ? res
          .status(400)
          .send({ status: "Bad Request", error: Object.values(result)[0] })
      : res.send({
          status: "Ok",
          message: `The products was updated in the cart (${cartId})`,
          data: result,
        });
  } catch (error) {
    res.status(500).send({ status: "Internal Server Error", error });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    const { quantity } = req.body;

    if (isNaN(quantity))
      return res.status(400).send({
        status: "Bad Request",
        error: "Quantity body param must be a number.",
      });

    let existCart = await cartDbManager.existCart(cartId);
    if (!existCart || existCart.reason)
      return res.status(404).send({
        status: "Not Found",
        error: "CartId doesn't exist",
      });

    let existProduct = await cartDbManager.existProductInCart(
      cartId,
      productId
    );
    if (!existProduct || existCart.reason)
      return res.status(404).send({
        status: "Not Found",
        error: `ProductId doesn't existe in CartId (${cartId})`,
      });

    let result = await cartDbManager.updateQuantityProductInCart(
      cartId,
      productId,
      quantity
    );
    Object.keys(result).includes("errors")
      ? res
          .status(400)
          .send({ status: "Bad Request", error: Object.values(result)[0] })
      : res.send({
          status: "Ok",
          message: `The product (${productId}) in the cart (${cartId}) was updated with quantity (${quantity}) `,
          data: result,
        });
  } catch (error) {
    return error;
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let existCart = await cartDbManager.existCart(cartId);
    if (!existCart || existCart.reason)
      return res.status(404).send({
        status: "Not Found",
        error: "CartId doesn't exist.",
      });

    let result = await cartDbManager.removeProductsInCart(cartId);
    Object.keys(result).includes("errors")
      ? res
          .status(400)
          .send({ status: "Bad Request", error: Object.values(result)[0] })
      : res.send({
          status: "Ok",
          message: `All products in the cart (${cartId}) was removed`,
          data: result,
        });
  } catch (error) {
    res.status(500).send({ status: "Internal Server Error", error });
  }
});

export default router;
