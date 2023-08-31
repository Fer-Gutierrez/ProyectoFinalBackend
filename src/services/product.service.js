import { HttpError, StatusCodes } from "../utils.js";
import FactoryDAO from "../dao/daoFactory.js";

class ProductService {
  constructor() {
    this.productManagerDAO = FactoryDAO.getProductManager();
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
    try {
      if (isNaN(limit) || (!isNaN(limit) && +limit <= 0))
        throw new HttpError(
          "limit must be a positive number",
          StatusCodes.BadRequest
        );

      if (isNaN(page) || (!isNaN(page) && +page <= 0))
        throw new HttpError(
          "page must be a positive number",
          StatusCodes.BadRequest
        );

      if (
        sort !== undefined &&
        sort.toLowerCase() !== "asc" &&
        sort.toLowerCase() !== "desc"
      )
        throw new HttpError(
          "sort must be a 'asc' or 'desc'",
          StatusCodes.BadRequest
        );

      if (status !== undefined && Number(status) !== 1 && Number(status) !== 0)
        throw new HttpError(
          "status must be a 1(true) or 0(false)",
          StatusCodes.BadRequest
        );

      if (price !== undefined && !isNaN(Number(price)) && Number(price) < 0)
        throw new HttpError(
          "price must be 0 or a positive number",
          StatusCodes.BadRequest
        );

      if (stock !== undefined && !isNaN(Number(stock)) && Number(stock) < 0)
        throw new HttpError(
          "stock must be 0 or a positive number",
          StatusCodes.BadRequest
        );

      let products = await this.productManagerDAO.getProducts(
        title,
        code,
        description,
        category,
        price,
        stock,
        status,
        page && Number(page),
        limit && Number(limit),
        sort
      );

      return products;
    } catch (error) {
      throw new HttpError(error.message, error.status || 500);
    }
  };

  getProductById = async (id) => {
    try {
      if (!id)
        throw new HttpError("id must have a value", StatusCodes.BadRequest);
      const product = await this.productManagerDAO.getProductById(id);
      if (!product)
        throw new HttpError("product not found", StatusCodes.NotFound);
      return product;
    } catch (error) {
      throw new HttpError(error.message, error.status || 500);
    }
  };

  addProduct = async (newProduct) => {
    try {
      if (
        !newProduct.code ||
        !newProduct.title ||
        !newProduct.description ||
        isNaN(newProduct.price) ||
        isNaN(newProduct.stock) ||
        !newProduct.category
      )
        throw new HttpError(
          "Some required params are missing or incorrect",
          StatusCodes.BadRequest
        );
      return await this.productManagerDAO.addProduct(newProduct);
    } catch (error) {
      throw new HttpError(error.message, error.status || 500);
    }
  };

  updateProduct = async (id, productToUpdate) => {
    try {
      let existProduct = await this.getProductById(id);
      if (!existProduct)
        throw new HttpError(
          `Product with id= ${id} not found.`,
          StatusCodes.NotFound
        );

      if (
        !productToUpdate.code ||
        !productToUpdate.title ||
        !productToUpdate.description ||
        isNaN(productToUpdate.price) ||
        isNaN(productToUpdate.stock) ||
        !productToUpdate.category
      )
        throw new HttpError(
          "Some params in Product to update are missing or incorrect",
          StatusCodes.BadRequest
        );
      return await this.productManagerDAO.updateProduct(id, productToUpdate);
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  deleteProduct = async (id) => {
    try {
      let existProduct = await this.getProductById(id);
      if (!existProduct)
        throw new HttpError(
          `Product with id= ${id} not found.`,
          StatusCodes.NotFound
        );
      return await this.productManagerDAO.deleteProduct(id);
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  existProduct = async (id) => {
    try {
      return await this.productManagerDAO.getProductById(id);
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };
}

export default new ProductService();
