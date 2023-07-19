import productModel from "../models/products.model.js";

export default class ProductDbManager {
  constructor() {
    console.log("Estamos trabajando con BDMongo (products)");
  }

  getProducts = async (
    title = "",
    code = "",
    description = "",
    category = "",
    price,
    stock,
    status
  ) => {
    let aggregationStages = [
      {
        $match: {
          title: { $regex: title, $options: "i" },
          description: { $regex: description, $options: "i" },
          code: { $regex: code, $options: "i" },
          category: { $regex: category, $options: "i" },
        },
      },
    ];
    price && aggregationStages.push({ $match: { price: price } });
    stock && aggregationStages.push({ $match: { stock: stock } });
    status !== undefined &&
      aggregationStages.push({ $match: { status: Boolean(Number(status)) } });

    let result = await productModel.aggregate(aggregationStages);
    return result;
  };

  getProductById = async (id) => {
    let product = await productModel.findOne({ _id: id });
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
      let result = await productModel.updateOne({ _id: id }, productToUpdate, {
        runValidators: true,
      });
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

  existProduct = async (id) => {
    try {
      let result = await productModel.findOne({ _id: id });
      return result;
    } catch (error) {
      return error;
    }
  };
}
