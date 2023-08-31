import __dirname, { HttpError, StatusCodes } from "../utils.js";
import CartIndexDao from "../dao/carts/cart.index.dao.js";
import ProductIndexDao from "../dao/products/product.index.dao.js";

const cartManagerDAO = CartIndexDao.getManager();
const productManagerDAO = ProductIndexDao.getManager();

class CartService {
  constructor() {}

  getCarts = async () => {
    try {
      return await cartManagerDAO.getCarts();
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
      return await cartManagerDAO.addCart(newCart);
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  getCartById = async (id) => {
    try {
      let cart = await cartManagerDAO.getCartById(id);
      if (!cart)
        throw new HttpError(`Cart (${id}) not found`, StatusCodes.NotFound);
      return cart;
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  addProductToCart = async (cartId, productId) => {
    try {
      const cartExists = await cartManagerDAO.getCartById(cartId);
      if (!cartExists)
        throw new HttpError(`Cart (${id}) not found`, StatusCodes.NotFound);
      const productExists = await productManagerDAO.getProductById(productId);
      if (!productExists)
        throw new HttpError(
          `Product (${productId}) not fountd`,
          StatusCodes.NotFound
        );
      return await cartManagerDAO.addProductToCart(cartId, productId);
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  existProductInCart = async (cartId, productId) => {
    try {
      return await cartManagerDAO.existProductInCart(cartId, productId);
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  removeProductInCart = async (cartId, productId) => {
    try {
      const cartExists = await cartManagerDAO.getCartById(cartId);
      if (!cartExists)
        throw new HttpError(`Cart (${id}) not found`, StatusCodes.NotFound);

      const existProductInCart = await cartManagerDAO.existProductInCart(
        cartId,
        productId
      );
      if (!existProductInCart)
        throw new HttpError(
          `ProductId (${productId}) not found in Cart (${cartId})`,
          StatusCodes.NotFound
        );

      return await cartManagerDAO.removeProductInCart(cartId, productId);
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  updateProductsInCart = async (cartId, products) => {
    try {
      const cartExists = await cartManagerDAO.getCartById(cartId);
      if (!cartExists)
        throw new HttpError(`Cart (${id}) not found`, StatusCodes.NotFound);

      if (!Array.isArray(products))
        throw new HttpError(
          "The param Body must be a Array object.",
          StatusCodes.BadRequest
        );

      if (await productManagerDAO.validateProductsArray(products)) {
        throw new HttpError(
          "One o more products in the body objet doesn't exist.",
          StatusCodes.BadRequest
        );
      }
      return await cartManagerDAO.updateProductsInCart(cartId, products);
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

      const cartExists = await cartManagerDAO.getCartById(cartId);
      if (!cartExists)
        throw new HttpError(
          `Cartid (${cartId}) not found`,
          StatusCodes.NotFound
        );

      const productExists = await cartManagerDAO.existProductInCart(
        cartId,
        productId
      );
      if (!productExists)
        throw new HttpError(
          `ProductId (${productId}) not found in Cart (${cartId})`,
          StatusCodes.NotFound
        );

      return await cartManagerDAO.updateQuantityProductInCart(
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
      const cartExists = await cartManagerDAO.getCartById(cartId);
      if (!cartExists) throw new HttpError(`Cartid (${cartId}) not found`, 404);
      return await cartManagerDAO.removeAllProductsInCart(cartId);
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };
}

export default new CartService();
