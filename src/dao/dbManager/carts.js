import cartModel from "../models/carts.model.js";

export default class CartDbManager {
  constructor() {
    console.log("Estamos trabajando con BDMongo (carts)");
  }

  getCarts = async () => {
    let carts = await cartModel.find().lean();
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
      let cart = await cartModel.findOne({ _id: cartId });
      console.log(cart);
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
}
