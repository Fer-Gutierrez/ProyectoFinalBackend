import cartModel from "../models/carts.model.js";

export default class CartDbManager {
  constructor() {
    console.log("Estamos trabajando con BDMongo (carts)");
  }

  getCarts = async () => {
    try {
      let carts = await cartModel.find().populate("products.product").lean();
      return carts;
    } catch (error) {
      throw new Error(
        `Error to try getCarts (Mongo persistence): ${error.message}`
      );
    }
  };

  addCart = async (newCart) => {
    try {
      let result = await cartModel.create(newCart);
      return result;
    } catch (error) {
      throw new Error(
        `Error to try addCart (Mongo persistence): ${error.message}`
      );
    }
  };

  getCartById = async (id) => {
    try {
      let cart = await cartModel
        .findOne({ _id: id })
        .populate("products.product");
      return cart;
    } catch (error) {
      throw new Error(
        `Error to try getCartById (Mongo persistence): ${error.message}`
      );
    }
  };

  addProductToCart = async (cartId, productId) => {
    try {
      let existProductInCart = await this.existProductInCart(cartId, productId);
      if (existProductInCart)
        return await this.updateQuantityProductInCart(cartId, productId, 1);

      let cart = await cartModel.findOne({ _id: cartId });

      cart.products.push({ product: productId });

      let result = await cartModel.updateOne({ _id: cartId }, cart, {
        runValidators: true,
      });
      return result;
    } catch (error) {
      throw new Error(
        `Error to try addProductToCart (Mongo persistence): ${error.message}`
      );
    }
  };

  existCart = async (cartId) => {
    try {
      let result = await cartModel.findOne({ _id: cartId });
      return result;
    } catch (error) {
      throw new Error(
        `Error to try existCart (Mongo persistence): ${error.message}`
      );
    }
  };

  existProductInCart = async (cartId, productId) => {
    try {
      let cart = await this.getCartById(cartId);
      let result = cart?.products.some(
        (p) => p.product._id.toString() === productId
      );
      return result;
    } catch (error) {
      throw new Error(
        `Error to try existProductInCart (Mongo persistence): ${error.message}`
      );
    }
  };

  removeProductInCart = async (cartId, productId) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      let newListProducts = cart.products.filter(
        (p) => p.product.toString() !== productId
      );

      cart.products = newListProducts;

      let result = cartModel.updateOne({ _id: cartId }, cart, {
        runValidators: true,
      });
      return result;
    } catch (error) {
      throw new Error(
        `Error to try removeProductInCart (Mongo persistence): ${error.message}`
      );
    }
  };

  updateProductsInCart = async (cartId, products) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      cart.products = products;
      let result = await cartModel.updateOne({ _id: cartId }, cart, {
        runValidators: true,
      });
      return result;
    } catch (error) {
      throw new Error(
        `Error to try updateProductsInCart (Mongo persistence): ${error.message}`
      );
    }
  };

  updateQuantityProductInCart = async (cartId, productId, quantity) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      let productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      cart.products[productIndex].quantity += quantity;
      let result = await cartModel.updateOne({ _id: cartId }, cart, {
        runValidators: true,
      });
      return result;
    } catch (error) {
      throw new Error(
        `Error to try updateQuantityProductInCart (Mongo persistence): ${error.message}`
      );
    }
  };

  removeAllProductsInCart = async (cartId) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      cart.products = [];
      let result = await cartModel.updateOne({ _id: cartId }, cart, {
        runValidators: true,
      });
      return result;
    } catch (error) {
      throw new Error(
        `Error to try removeAllProductsInCart (Mongo persistence): ${error.message}`
      );
    }
  };
}
