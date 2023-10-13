import __dirname from "../utils.js";
import FactoryDAO from "../dao/daoFactory.js";
import {
  AuthorizationError,
  BadRequestError,
  NotFoundError,
} from "../exceptions/exceptions.js";

class CartService {
  constructor() {
    this.cartManagerDAO = FactoryDAO.getCartManager();
    this.productManagerDAO = FactoryDAO.getProductManager();
  }

  getCarts = async () => {
    try {
      return await this.cartManagerDAO.getCarts();
    } catch (error) {
      throw error;
    }
  };

  addCart = async (newCart) => {
    try {
      if (!Array.isArray(newCart.products))
        throw new BadRequestError(
          "The new Cart must have a array property called 'products'"
        );
      return await this.cartManagerDAO.addCart(newCart);
    } catch (error) {
      throw error;
    }
  };

  getCartById = async (id) => {
    try {
      let cart = await this.cartManagerDAO.getCartById(id);
      if (!cart) throw new NotFoundError(`Cart (${id}) not found`);
      return cart;
    } catch (error) {
      throw error;
    }
  };

  addProductToCart = async (cartId, productId, user) => {
    try {
      const cartExists = await this.cartManagerDAO.getCartById(cartId);
      if (!cartExists) throw new NotFoundError(`Cart (${id}) not found`);
      const productExists = await this.productManagerDAO.getProductById(
        productId
      );
      if (!productExists)
        throw new NotFoundError(`Product (${productId}) not fountd`);
      if (user?.role === "premium" && productExists.owner === user?.id)
        throw new BadRequestError("You can't add your own product.");
      return await this.cartManagerDAO.addProductToCart(cartId, productId);
    } catch (error) {
      throw error;
    }
  };

  existProductInCart = async (cartId, productId) => {
    try {
      return await this.cartManagerDAO.existProductInCart(cartId, productId);
    } catch (error) {
      throw error;
    }
  };

  removeProductInCart = async (cartId, productId) => {
    try {
      const cartExists = await this.cartManagerDAO.getCartById(cartId);
      if (!cartExists) throw new NotFoundError(`Cart (${id}) not found`);

      const existProductInCart = await this.cartManagerDAO.existProductInCart(
        cartId,
        productId
      );
      if (!existProductInCart)
        throw new NotFoundError(
          `ProductId (${productId}) not found in Cart (${cartId})`
        );

      return await this.cartManagerDAO.removeProductInCart(cartId, productId);
    } catch (error) {
      throw error;
    }
  };

  updateProductsInCart = async (cartId, products, user) => {
    try {
      const cartExists = await this.cartManagerDAO.getCartById(cartId);
      if (!cartExists) throw new NotFoundError(`Cart (${cartId}) not found`);

      if (!Array.isArray(products))
        throw new BadRequestError("The param Body must be a Array object.");

      if (!(await this.productManagerDAO.validateProductsArray(products))) {
        throw new BadRequestError(
          "One o more products in the body objet doesn't exist."
        );
      }

      if (
        !(await this.productManagerDAO.validateOwnerOfProductsArray(
          products,
          user
        ))
      ) {
        throw new BadRequestError(
          "One o more products in the body objet belong to you. You can't add your own product to your cart."
        );
      }

      return await this.cartManagerDAO.updateProductsInCart(cartId, products);
    } catch (error) {
      throw error;
    }
  };

  updateQuantityProductInCart = async (cartId, productId, quantity) => {
    try {
      if (isNaN(quantity))
        throw new BadRequestError("Quantity body param must be a number");

      const cartExists = await this.cartManagerDAO.getCartById(cartId);
      if (!cartExists) throw new NotFoundError(`Cartid (${cartId}) not found`);

      const productExists = await this.cartManagerDAO.existProductInCart(
        cartId,
        productId
      );
      if (!productExists)
        throw new NotFoundError(
          `ProductId (${productId}) not found in Cart (${cartId})`
        );

      return await this.cartManagerDAO.updateQuantityProductInCart(
        cartId,
        productId,
        quantity
      );
    } catch (error) {
      throw error;
    }
  };

  removeAllProductsInCart = async (cartId) => {
    try {
      const cartExists = await this.cartManagerDAO.getCartById(cartId);
      if (!cartExists) throw new NotFoundError(`Cartid (${cartId}) not found`);
      return await this.cartManagerDAO.removeAllProductsInCart(cartId);
    } catch (error) {
      throw error;
    }
  };
}

export default new CartService();
