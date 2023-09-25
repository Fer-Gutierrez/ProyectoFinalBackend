import cartService from "../services/cart.service.js";
import ticketService from "../services/ticket.service.js";
class CartController {
  constructor() {}

  async getCarts(req, res, next) {
    try {
      let carts = await cartService.getCarts();
      res.sendSuccess(carts);
    } catch (error) {
      next(error);
    }
  }

  async addCart(req, res, next) {
    try {
      let result = await cartService.addCart({ products: [] });
      res.sendSuccess({ message: "Cart added.", data: result });
    } catch (error) {
      next(error);
    }
  }

  async getCartById(req, res, next) {
    try {
      const cartId = req.params.cid;
      let cart = await cartService.getCartById(cartId);
      res.sendSuccess(cart);
    } catch (error) {
      next(error);
    }
  }

  async addProductToCart(req, res, next) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const user = req.user;

      const result = await cartService.addProductToCart(
        cartId,
        productId,
        user
      );
      res.sendSuccess({
        message: "The product was added in cart",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeProductInCart(req, res, next) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const result = await cartService.removeProductInCart(cartId, productId);
      res.sendSuccess({
        message: `The productId ${productId} was removed from the cart (${cartId})`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProductsInCart(req, res, next) {
    try {
      const cartId = req.params.cid;
      const arrayOfIdProducts = req.body;
      const user = req.user;

      const result = await cartService.updateProductsInCart(
        cartId,
        arrayOfIdProducts,
        user
      );
      res.sendSuccess({
        message: `The List Products was updated in the cart (${cartId})`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateQuantityProductInCart(req, res, next) {
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
      next(error);
    }
  }

  async removeAllProductInCart(req, res, next) {
    try {
      const cartId = req.params.cid;

      const result = await cartService.removeAllProductsInCart(cartId);
      res.sendSuccess({
        message: `All products in the cart (${cartId}) was removed`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  purchaseCart = async (req, res, next) => {
    try {
      const cartId = req.params.cid;
      const user = req.session?.user || req.user;
      const result = await ticketService.createTicket(user, cartId);
      if (result.ticket) {
        return res.sendSuccess({ message: "Ticket created", data: result });
      } else {
        return res.sendSuccess({
          message: "Ticket not created",
          data: result,
        });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default new CartController();
