import cartService from "../services/cart.service.js";
import productService from "../services/product.service.js";

class CartController {
  constructor() {}

  async getCarts(req, res) {
    try {
      let carts = await cartService.getCarts();
      res.sendSuccess(carts);
    } catch (error) {
      res.sendError({ message: error.message }, error.status);
    }
  }

  async addCart(req, res) {
    try {
      let result = await cartService.addCart({ products: [] });
      res.sendSuccess({ message: "Cart added.", data: result });
    } catch (error) {
      res.sendError({ message: error.message }, error.status);
    }
  }

  async getCartById(req, res) {
    try {
      const cartId = req.params.cid;
      let cart = await cartService.getCartById(cartId);
      res.sendSuccess(cart);
    } catch (error) {
      res.sendError({ message: error.message }, error.status);
    }
  }

  async addProductToCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;

      const result = await cartService.addProductToCart(cartId, productId);
      res.sendSuccess({
        message: "The product was added in cart",
        data: result,
      });
    } catch (error) {
      res.sendError({ message: error.message }, error.status);
    }
  }

  async removeProductInCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const result = await cartService.removeProductInCart(cartId, productId);
      res.sendSuccess({
        message: `The productId ${productId} was removed from the cart (${cartId})`,
        data: result,
      });
    } catch (error) {
      res.sendError({ message: error.message }, error.status);
    }
  }

  async updateProductsInCart(req, res) {
    try {
      const cartId = req.params.cid;
      const arrayOfIdProducts = req.body;

      const result = await cartService.updateProductsInCart(
        cartId,
        arrayOfIdProducts
      );
      res.sendSuccess({
        message: `The List Products was updated in the cart (${cartId})`,
        data: result,
      });
    } catch (error) {
      res.sendError({ message: error.message }, error.status);
    }
  }

  async updateQuantityProductInCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const { quantity } = req.body;

      const result = await cartService.updateQuantityProductInCart(
        cartId,
        productId,
        quantity
      );
      res.sendSuccess({
        message: `The product (${productId}) in the cart (${cartId}) was incremented with ${quantity} units.`,
        data: result,
      });
    } catch (error) {
      res.sendError({ message: error.message }, error.status);
    }
  }

  async removeAllProductInCart(req, res) {
    try {
      const cartId = req.params.cid;

      const result = await cartService.removeAllProductsInCart(cartId);
      res.sendSuccess({
        message: `All products in the cart (${cartId}) was removed`,
        data: result,
      });
    } catch (error) {
      res.sendError({ message: error.message });
    }
  }
}

export default new CartController();
