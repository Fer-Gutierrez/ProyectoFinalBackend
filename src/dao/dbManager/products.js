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
    status,
    page = 1,
    limit = 10,
    sort
  ) => {
    let queryFilter = {
      title: { $regex: title, $options: "i" },
      description: { $regex: description, $options: "i" },
      code: { $regex: code, $options: "i" },
      category: { $regex: category, $options: "i" },
    };
    if (price) queryFilter.price = price;
    if (stock) queryFilter.stock = stock;
    if (status) queryFilter.status = Boolean(Number(status));

    let sortOptions = {};
    if (sort)
      sort === "desc" ? (sortOptions.price = -1) : (sortOptions.price = 1);

    let result = await productModel.paginate(queryFilter, {
      page,
      limit,
      lean: true,
      sort: sortOptions,
    });

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
