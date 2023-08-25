import cartModel from "../models/carts.model.js";

export default class CartDbManager {
  constructor() {
    console.log("Estamos trabajando con BDMongo (carts)");
  }

  getCarts = async () => {
    let carts = await cartModel.find().populate("products.product").lean();
    return carts;
  };

  getCartById = async (id) => {
    let cart = await cartModel
      .findOne({ _id: id })
      .populate("products.product");

    return cart;
  };

  addCart = async (newCart) => {
    try {
      let result = await cartModel.create(newCart);
      return result;
    } catch (error) {
      return error;
    }
  };

  addProductToCart = async (cartId, productId) => {
    try {
      let existProductInCart = await this.existProductInCart(cartId, productId);
      if (existProductInCart) {
        return await this.updateQuantityProductInCart(cartId, productId, 1);
      }

      let cart = await cartModel.findOne({ _id: cartId });
      cart.products.push({ product: productId });

      let result = await cartModel.updateOne({ _id: cartId }, cart, {
        runValidators: true,
      });
      return result;
    } catch (error) {
      return error;
    }
  };

  existCart = async (cartId) => {
    try {
      let result = await cartModel.findOne({ _id: cartId });
      return result;
    } catch (error) {
      return error;
    }
  };

  existProductInCart = async (cartId, productId) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      let result = cart.products.some(
        (p) => p.product.toString() === productId
      );
      return result;
    } catch (error) {
      return error;
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
      return error;
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
      return error;
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
      return error;
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
      return error;
    }
  };
}
