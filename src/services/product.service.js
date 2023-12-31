import FactoryDAO from "../dao/daoFactory.js";
import {
  NotFoundError,
  BadRequestError,
  AuthorizationError,
} from "../exceptions/exceptions.js";
import mailService from "./mail.service.js";

class ProductService {
  constructor() {
    this.productManagerDAO = FactoryDAO.getProductManager();
    this.userManagerDAO = FactoryDAO.getUserManager();
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
        throw new BadRequestError("limit must be a positive number");

      if (isNaN(page) || (!isNaN(page) && +page <= 0))
        throw new BadRequestError("page must be a positive number");

      if (
        sort !== undefined &&
        sort.toLowerCase() !== "asc" &&
        sort.toLowerCase() !== "desc"
      )
        throw new BadRequestError("sort must be a 'asc' or 'desc'");

      if (status !== undefined && Number(status) !== 1 && Number(status) !== 0)
        throw new BadRequestError("status must be a 1(true) or 0(false)");

      if (price !== undefined && !isNaN(Number(price)) && Number(price) < 0)
        throw new BadRequestError("price must be 0 or a positive number");

      if (stock !== undefined && !isNaN(Number(stock)) && Number(stock) < 0)
        throw new BadRequestError("stock must be 0 or a positive number");

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
      throw error;
    }
  };

  getProductById = async (id) => {
    try {
      if (!id) throw new BadRequestError("id must have a value");
      const product = await this.productManagerDAO.getProductById(id);
      if (!product) throw new NotFoundError(`product with id ${id} not found`);
      return product;
    } catch (error) {
      throw error;
    }
  };

  addProduct = async (newProduct) => {
    try {
      const errors = [];
      if (!newProduct.code)
        errors.push("Missing 'code' property: expected string");
      if (!newProduct.title)
        errors.push("Missing 'title' property: expected string");
      if (!newProduct.description)
        errors.push("Missing 'description' property: expected string");
      if (
        isNaN(newProduct.price) ||
        newProduct.price === "" ||
        newProduct.price === undefined
      )
        errors.push("Invalid type for 'price': expected number");
      if (
        isNaN(newProduct.stock) ||
        newProduct.stock === "" ||
        newProduct.stock === undefined
      )
        errors.push("Invalid type for 'stock': expected number");
      if (!newProduct.category)
        errors.push("Missing 'category' property: expected string");
      if (errors.length > 0) throw new BadRequestError(errors.join("\n"));

      return await this.productManagerDAO.addProduct(newProduct);
    } catch (error) {
      throw error;
    }
  };

  updateProduct = async (id, productToUpdate) => {
    try {
      let existProduct = await this.getProductById(id);
      if (!existProduct)
        throw new NotFoundError(`Product with id= ${id} not found.`);

      if (productToUpdate.owner && productToUpdate.owner !== existProduct.owner)
        throw new AuthorizationError("Owner not authorized.");

      //Actualizamos el owner para cuando el admin edita:
      productToUpdate.owner = existProduct.owner;

      const errors = [];
      if (!productToUpdate.code)
        errors.push("Missing 'code' property: expected string");
      if (!productToUpdate.title)
        errors.push("Missing 'title' property: expected string");
      if (!productToUpdate.description)
        errors.push("Missing 'description' property: expected string");
      if (
        isNaN(productToUpdate.price) ||
        productToUpdate.price === "" ||
        productToUpdate.price === undefined
      )
        errors.push("Invalid type for 'price': expected number");
      if (
        isNaN(productToUpdate.stock) ||
        productToUpdate.stock === "" ||
        productToUpdate.stock === undefined
      )
        errors.push("Invalid type for 'stock': expected number");
      if (!productToUpdate.category)
        errors.push("Missing 'category' property: expected string");
      if (errors.length > 0) throw new BadRequestError(errors.join("\n"));

      return await this.productManagerDAO.updateProduct(id, productToUpdate);
    } catch (error) {
      throw error;
    }
  };

  deleteProduct = async (id, user) => {
    try {
      let existProduct = await this.getProductById(id);
      if (!existProduct)
        throw new NotFoundError(`Product with id= ${id} not found.`);

      if (user.role === "premium" && user.id !== existProduct.owner)
        throw new AuthorizationError("Owner not authorized.");

      let result = await this.productManagerDAO.deleteProduct(id);

      if (existProduct.owner !== "admin") {
        let userOwner = await this.userManagerDAO.getById(existProduct.owner);
        if (userOwner && userOwner?.role === "premium") {
          let mailSent = await mailService.sendSimpleMail({
            from: "",
            to: userOwner.email,
            subject: `Producto ${existProduct.title} (${existProduct._id}) Borrado`,
            html: `
            <div>
              <p>Hola ${userOwner.first_name}:</p>
              <p>Le informamos que el siguiente producto a sido eliminado:</p>
              <p>Title:${existProduct.title}</p>
              <p>Code:${existProduct.code}</p>
              <p>Description:${existProduct.description}</p>
              <p>Categoy:${existProduct.category}</p>
              <p>Price:${existProduct.price}</p>
              <p>Stock:${existProduct.stock}</p>
              <p>Status:${existProduct.status}</p>
              <p>Muchas Gracias!</p>
            </div>`,
          });
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  existProduct = async (id) => {
    try {
      return await this.productManagerDAO.getProductById(id);
    } catch (error) {
      throw error;
    }
  };
}

export default new ProductService();
