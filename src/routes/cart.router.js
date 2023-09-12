import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import { authRole, userCookieExtractor } from "../middlewares/middlewares.js";

class CartRouter {
  constructor() {
    this.inicioCart = Router();
    this.inicioCart.get("/", cartController.getCarts);
    this.inicioCart.post("/", cartController.addCart);
    this.inicioCart.get("/:cid", cartController.getCartById);
    this.inicioCart.post(
      "/:cid/products/:pid",
      authRole(["anyone", "usuario"]),
      cartController.addProductToCart
    );
    this.inicioCart.delete(
      "/:cid/products/:pid",
      cartController.removeProductInCart
    );
    this.inicioCart.put("/:cid", cartController.updateProductsInCart);
    this.inicioCart.put(
      "/:cid/products/:pid",
      cartController.updateQuantityProductInCart
    );
    this.inicioCart.delete("/:cid", cartController.removeAllProductInCart);
    this.inicioCart.post(
      "/:cid/purchase",
      userCookieExtractor,
      cartController.purchaseCart
    );
  }

  getRouter() {
    return this.inicioCart;
  }
}

export default new CartRouter();
