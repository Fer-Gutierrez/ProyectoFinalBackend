import __dirname from "../utils.js";
import CartIndexDao from "../dao/carts/cart.index.dao.js";

const cartIndexDAO = CartIndexDao.getManager();

class CartService {
  constructor() {}

  getCarts = async () => {
    try {
      return await cartIndexDAO.getCarts();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getCartById = async (id) => {
    try {
      let cart = await cartIndexDAO.getCartById(id);
      console.log(cart);
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  addCart = async (newCart) => {
    try {
      return await cartIndexDAO.addCart(newCart);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  addProductToCart = async (cartId, productId) => {
    try {
      return await cartIndexDAO.addProductToCart(cartId, productId);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  existCart = async (cartId) => {
    try {
      return await cartIndexDAO.existCart(cartId);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  existProductInCart = async (cartId, productId) => {
    try {
      return await cartIndexDAO.existProductInCart(cartId, productId);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  removeProductInCart = async (cartId, productId) => {
    try {
      return await cartIndexDAO.removeProductInCart(cartId, productId);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateProductsInCart = async (cartId, products) => {
    try {
      return await cartIndexDAO.updateProductsInCart(cartId, products);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateQuantityProductInCart = async (cartId, productId, quantity) => {
    try {
      return await cartIndexDAO.updateProductsInCart(
        cartId,
        productId,
        quantity
      );
    } catch (error) {
      throw new Error(error.message);
    }
  };

  removeAllProductsInCart = async (cartId) => {
    try {
     return await cartIndexDAO.removeAllProductsInCart(cartId)
    } catch (error) {
      throw new Error(error.message);
    }
  };

}

export default new CartService();

