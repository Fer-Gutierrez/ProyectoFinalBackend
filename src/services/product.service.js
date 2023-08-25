import productModel from "../dao/models/products.model.js";
import fs from "fs";
import __dirname from "../utils.js";
import ProductIndexDao from "../dao/products/product.index.dao.js";

const productIndexDAO = ProductIndexDao.getManager();

class ProductService {
  constructor() {}

  getProducts = async (
    title = "",
    code = "",
    description = "",
    category = "",
    price,
    stock,
    status,
    page,
    limit,
    sort
  ) => {
    try {
      let products = await productIndexDAO.getProducts(
        title,
        code,
        description,
        category,
        price,
        stock,
        status,
        page,
        limit,
        sort
      );
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getProductById = async (id) => {
    try {
      return await productIndexDAO.getProductById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  addProduct = async (newProduct) => {
    try {
      return await productIndexDAO.addProduct(newProduct);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateProduct = async (id, productToUpdate) => {
    try {
      return await productIndexDAO.updateProduct(id, productToUpdate);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  deleteProduct = async (id) => {
    try {
      return await productIndexDAO.deleteProduct(id);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  existProduct = async (id) => {
    try {
      return await productIndexDAO.getProductById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  //FileProducts:
  getFileProducts = async () => {
    try {
      if (!fs.existsSync(this.__path))
        await fs.promises.writeFile(this.__path, "[]");
      if (fs.existsSync(this.__path)) {
        const products = await fs.promises.readFile(this.__path, "utf-8");
        return JSON.parse(products);
      }
    } catch (error) {
      throw new Error(error, message);
    }
  };

  getFileProductById = async (id) => {
    try {
      if (isNaN(id) || (!isNaN(id) && id < 1))
        throw new Error("Debe especificar un id numérico");

      const products = await this.getFileProducts();
      let product = products.find((p) => p?.id === id);
      if (!product) throw new Error("Not found");
      return product;
    } catch (error) {
      throw new Error(error, message);
    }
  };

  fileProductWithAllProperties = (product) => {
    try {
      let properties = Object.keys(new Product());
      let productProperties = Object.keys(product);
      let missingProps = [];
      properties.forEach(
        (p) => productProperties.includes(p) || missingProps.push(p)
      );

      return missingProps.length > 0 && missingProps;
    } catch (error) {
      throw new Error(error, message);
    }
  };

  fileProductHaveRequiredProps = (product) => {
    try {
      let propSinValor = [];
      Object.entries(product).forEach((prop) => {
        if (prop[0] !== "thumbnails" && prop[0] !== "id") {
          (prop[1] === null || prop[1] === undefined || !prop[1].toString()) &&
            propSinValor.push(prop[0]);
        }
        if (prop[0] === "price" || prop[0] === "stock") {
          isNaN(prop[1]) && (propSinValor = [...propSinValor, prop[0]]);
        }
      });

      return propSinValor.length > 0 && propSinValor;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  addFileProduct = async (newProduct) => {
    try {
      //Verificamos si el producto tenga todas la propiedades
      let missingProps = this.fileProductWithAllProperties(newProduct);
      if (missingProps)
        throw new Error(
          `The produsct doesn't have all properties. The following properties are missing: ${missingProps.join(
            ", "
          )}`
        );

      //Verificar que las propiedades requeridas tengan valor
      let propSinValor = this.fileProductHaveRequiredProps(newProduct);
      if (propSinValor)
        throw new Error(
          `The following properties can't be empty: ${propSinValor.join(", ")}`
        );

      let products = await this.getFileProducts();

      //Verificamos que no se repita el codigo
      let repeatedCode = products?.some((p) => p?.code === newProduct?.code);
      if (repeatedCode) throw new Error("Repeted Code");

      //Asignamos el id
      products.length === 0
        ? (newProduct.id = 1)
        : (newProduct.id = products[products.length - 1].id + 1);

      //Agregamos el producto
      products.push(newProduct);
      await fs.promises.writeFile(
        this.__path,
        JSON.stringify(products, null, "\t")
      );
      return newProduct;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateFileProduct = async (id, productToUpdate) => {
    try {
      let products = await this.getFileProducts();

      //Verificar si id es numerico
      if (isNaN(id)) throw new Error("id must be positive number");
      else if (!products.some((p) => p?.id === id))
        throw new Error("Not Found");

      //Verificar cada propiedad de productToUpdate conincida
      let missingProps = this.productWithAllProperties(productToUpdate);
      if (missingProps)
        throw new Error(
          `The produsct doesn't have all properties. The following properties are missing: ${missingProps.join(
            ", "
          )}`
        );

      //Verificar existencias de las prop obligatorias
      let propSinValor = this.productHaveRequiredProps(productToUpdate);
      if (propSinValor)
        throw new Error(
          `The following properties can't be empty: ${propSinValor.join(", ")}`
        );

      //Verificar que no se repita el code
      let repeatedCode = products.some(
        (p) => p.id !== id && p.code === productToUpdate.code
      );
      if (repeatedCode) throw new Error("Repeated Code");

      //Editamos
      let newListProducts = products.map((p) => {
        if (p.id === id) {
          return { ...productToUpdate, id: id };
        } else {
          return p;
        }
      });
      await fs.promises.writeFile(
        this.__path,
        JSON.stringify(newListProducts, null, "\t")
      );

      return { ...productToUpdate, id };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  deleteFileProduct = async (id) => {
    try {
      let products = await this.getFileProducts();

      //Verificar si id es numerico
      if (isNaN(id)) throw new Error("El id deber ser numérico");
      else if (!products.some((p) => p?.id === id))
        throw new Error("Not Found");

      //Eliminamos
      let deletedProduct = products.find((p) => p?.id === id);
      let newProducts = products.filter((p) => p?.id !== id);
      await fs.promises.writeFile(
        this.__path,
        JSON.stringify(newProducts, null, "\t")
      );

      return deletedProduct;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default new ProductService();

class Product {
  constructor(
    code,
    title,
    description,
    price,
    status,
    stock,
    category,
    thumbnails = []
  ) {
    this.id = undefined;
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = price;
    this.status = status;
    this.stock = stock;
    this.category = category;
    this.thumbnails = thumbnails;
  }
}
