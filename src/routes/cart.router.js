import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import { generateCustomResponses } from "../utils.js";

class CartRouter {
  constructor() {
    this.inicioCart = Router();
    this.inicioCart.get("/", generateCustomResponses, cartController.getCarts);
    this.inicioCart.post("/", generateCustomResponses, cartController.addCart);
    this.inicioCart.get(
      "/:cid",
      generateCustomResponses,
      cartController.getCartById
    );
    this.inicioCart.post(
      "/:cid/products/:pid",
      generateCustomResponses,
      cartController.addProductToCart
    );
    this.inicioCart.delete(
      "/:cid/products/:pid",
      generateCustomResponses,
      cartController.removeProductInCart
    );
    this.inicioCart.put(
      "/:cid",
      generateCustomResponses,
      cartController.updateProductsInCart
    );
    this.inicioCart.put(
      "/:cid/products/:pid",
      generateCustomResponses,
      cartController.updateQuantityProductInCart
    );
    this.inicioCart.delete(
      "/:cid",
      generateCustomResponses,
      cartController.removeAllProductInCart
    );
  }

  getRouter() {
    return this.inicioCart;
  }
}

export default new CartRouter();