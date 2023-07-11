import cartModel from "../models/carts";

export default class Carts {
  constructor() {
    console.log("Estamos trabajando con BDMongo (carts)");
  }

  getCarts = async () => {
    let carts = await cartModel.find().lean();
    return carts;
  };

  getCartById = async (id) => {
    let cart = await cartModel.findOne({ _id: id });
  };

  addCart = async (newCart) => {
    try {
      let result = await cartModel.create(newCart);
      return result;
    } catch (error) {
      return error;
    }
  };

  addProductToCart = async (cartId, product) => {
    try {
      let cart = cartModel.findOne({ _id: cartId });
      let newListProducts = cart.products;
      newListProducts.push(product);

      let result = cart.updateOne({ products: newListProducts });
      return result;
    } catch (error) {
      return error;
    }
  };
}
