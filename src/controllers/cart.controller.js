import cartService from "../services/cart.service.js";
import productService from "../services/product.service.js";

class CartController {
  constructor() {}

  async getCarts(req, res) {
    try {
      let carts = await cartService.getCarts();
      res.sendSuccess(carts);
    } catch (error) {
      res.sendError({ message: error.message });
    }
  }

  async addCart(req, res) {
    try {
      let result = await cartService.addCart({ products: [] });
      res.sendSuccess({ message: "Cart added.", data: result });
    } catch (error) {
      res.sendError({ message: error.message });
    }
  }

  async getCartById(req, res) {
    try {
      const cartId = req.params.cid;
      let cart = await cartService.getCartById(cartId);
      if (!cart) return res.sendError({ message: "Cart not found" }, 404);
      res.sendSuccess(cart);
    } catch (error) {
      console.log(error);
      console.log(`Estamos  en el error:  ${error.message} - ${error.status}`);
      res.sendError({ message: error.message }, error.status);
    }
  }

  async addProductToCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;

      const cartExists = await cartService.existCart(cartId);
      if (!cartExists || cartExists.reason)
        return res.sendError({ message: `Cartid (${cartId}) not found` }, 404);

      const productExists = await productService.existProduct(productId);
      if (!productExists || productExists.reason)
        return res.sendError(
          { message: `ProductId (${productId}) not found` },
          404
        );

      const result = await cartService.addProductToCart(cartId, productId);
      res.sendSuccess({
        message: "The product was added in cart",
        data: result,
      });
    } catch (error) {
      res.sendError({ message: error.message });
    }
  }

  async removeProductInCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;

      const cartExists = await cartService.existCart(cartId);
      if (!cartExists || cartExists.reason)
        return res.sendError({ message: `Cartid (${cartId}) not found` }, 404);

      const productExists = await productService.existProduct(productId);
      if (!productExists || productExists.reason)
        return res.sendError(
          { message: `ProductId (${productId}) not found` },
          404
        );

      const result = await cartService.removeProductInCart(cartId, productId);
      res.sendSuccess({
        message: `The productId ${productId} was removed from the cart (${cartId})`,
        data: result,
      });
    } catch (error) {
      res.sendError({ message: error.message });
    }
  }

  async updateProductsInCart(req, res) {
    try {
      const cartId = req.params.cid;
      const arrayOfIdProducts = req.body;

      const cartExists = await cartService.existCart(cartId);
      if (!cartExists || cartExists.reason)
        return res.sendError({ message: `Cartid (${cartId}) not found` }, 404);

      if (!Array.isArray(arrayOfIdProducts))
        return res.sendError(
          { message: "The param Body must be a Array object." },
          400
        );

      const result = await cartService.updateProductsInCart(
        cartId,
        arrayOfIdProducts
      );
      res.sendSuccess({
        message: `The List Products was updated in the cart (${cartId})`,
        data: result,
      });
    } catch (error) {
      res.sendError({ message: error.message });
    }
  }

  async updateQuantityProductInCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const { quantity } = req.body;

      if (isNaN(quantity))
        return res.sendError(
          { message: "Quantity body param must be a number." },
          400
        );

      const cartExists = await cartService.existCart(cartId);
      if (!cartExists || cartExists.reason)
        return res.sendError({ message: `Cartid (${cartId}) not found` }, 404);

      const productExists = await productService.existProduct(productId);
      if (!productExists || productExists.reason)
        return res.sendError(
          { message: `ProductId (${productId}) not found` },
          404
        );

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
      res.sendError({ message: error.message });
    }
  }

  async removeAllProductInCart(req, res) {
    try {
      const cartId = req.params.cid;

      const cartExists = await cartService.existCart(cartId);
      if (!cartExists || cartExists.reason)
        return res.sendError({ message: `Cartid (${cartId}) not found` }, 404);

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
