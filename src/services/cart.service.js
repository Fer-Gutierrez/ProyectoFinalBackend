import __dirname, { HttpError, StatusCodes } from "../utils.js";
import FactoryDAO from "../dao/daoFactory.js";

class CartService {
  constructor() {
    this.cartManagerDAO = FactoryDAO.getCartManager();
    this.productManagerDAO = FactoryDAO.getProductManager();
  }

  getCarts = async () => {
    try {
      return await this.cartManagerDAO.getCarts();
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  addCart = async (newCart) => {
    try {
      if (!Array.isArray(newCart.products))
        throw new HttpError(
          "The new Cart must have a array property called 'products'",
          StatusCodes.BadRequest
        );
      return await this.cartManagerDAO.addCart(newCart);
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  getCartById = async (id) => {
    try {
      let cart = await this.cartManagerDAO.getCartById(id);
      if (!cart)
        throw new HttpError(`Cart (${id}) not found`, StatusCodes.NotFound);
      return cart;
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  addProductToCart = async (cartId, productId) => {
    try {
      const cartExists = await this.cartManagerDAO.getCartById(cartId);
      if (!cartExists)
        throw new HttpError(`Cart (${id}) not found`, StatusCodes.NotFound);
      const productExists = await this.productManagerDAO.getProductById(
        productId
      );
      if (!productExists)
        throw new HttpError(
          `Product (${productId}) not fountd`,
          StatusCodes.NotFound
        );
      return await this.cartManagerDAO.addProductToCart(cartId, productId);
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  existProductInCart = async (cartId, productId) => {
    try {
      return await this.cartManagerDAO.existProductInCart(cartId, productId);
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  removeProductInCart = async (cartId, productId) => {
    try {
      const cartExists = await this.cartManagerDAO.getCartById(cartId);
      if (!cartExists)
        throw new HttpError(`Cart (${id}) not found`, StatusCodes.NotFound);

      const existProductInCart = await this.cartManagerDAO.existProductInCart(
        cartId,
        productId
      );
      if (!existProductInCart)
        throw new HttpError(
          `ProductId (${productId}) not found in Cart (${cartId})`,
          StatusCodes.NotFound
        );

      return await this.cartManagerDAO.removeProductInCart(cartId, productId);
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  updateProductsInCart = async (cartId, products) => {
    try {
      const cartExists = await this.cartManagerDAO.getCartById(cartId);
      if (!cartExists)
        throw new HttpError(`Cart (${id}) not found`, StatusCodes.NotFound);

      if (!Array.isArray(products))
        throw new HttpError(
          "The param Body must be a Array object.",
          StatusCodes.BadRequest
        );

      if (!(await this.productManagerDAO.validateProductsArray(products))) {
        throw new HttpError(
          "One o more products in the body objet doesn't exist.",
          StatusCodes.BadRequest
        );
      }
      return await this.cartManagerDAO.updateProductsInCart(cartId, products);
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  updateQuantityProductInCart = async (cartId, productId, quantity) => {
    try {
      if (isNaN(quantity))
        throw new HttpError(
          "Quantity body param must be a number",
          StatusCodes.BadRequest
        );

      const cartExists = await this.cartManagerDAO.getCartById(cartId);
      if (!cartExists)
        throw new HttpError(
          `Cartid (${cartId}) not found`,
          StatusCodes.NotFound
        );

      const productExists = await this.cartManagerDAO.existProductInCart(
        cartId,
        productId
      );
      if (!productExists)
        throw new HttpError(
          `ProductId (${productId}) not found in Cart (${cartId})`,
          StatusCodes.NotFound
        );

      return await this.cartManagerDAO.updateQuantityProductInCart(
        cartId,
        productId,
        quantity
      );
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  removeAllProductsInCart = async (cartId) => {
    try {
      const cartExists = await this.cartManagerDAO.getCartById(cartId);
      if (!cartExists) throw new HttpError(`Cartid (${cartId}) not found`, 404);
      return await this.cartManagerDAO.removeAllProductsInCart(cartId);
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };
}

export default new CartService();
