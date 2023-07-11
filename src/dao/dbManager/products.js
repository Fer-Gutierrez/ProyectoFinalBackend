import productModel from "../models/products";

export default class Products {
  constructor() {
    console.log("Estamos trabajando con BDMongo (products)");
  }

  getProducts = async () => {
    let products = await productModel.find().lean();
    return products;
  };

  getProductById = async (id) => {
    let product = await productModel.find((p) => p._id === id);
    return product;
  };

  addProduct = async (newProduct) => {
    try {
      let result = await productModel.create(newProduct);
      return result;
    } catch (error) {
      return error;
    }
  };

  updateProduct = async (id, productToUpdate) => {
    try {
      let result = await productModel.updateOne({ _id: id }, productToUpdate);
      return result;
    } catch (error) {
      return error;
    }
  };

  deleteProduct = async (id) => {
    try {
      let result = await productModel.deleteOne({ _id: id });
      return result;
    } catch (error) {
      return error;
    }
  };
}
