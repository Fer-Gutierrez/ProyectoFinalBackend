import fs from "fs";
import { BadRequestError, NotFoundError } from "../../exceptions/exceptions.js";

export class Product {
  constructor(
    code,
    title,
    description,
    price,
    status,
    stock,
    category,
    thumbnails = [],
    owner = "admin"
  ) {
    this.id = undefined;
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = +price;
    this.status = Boolean(status);
    this.stock = +stock;
    this.category = category;
    this.thumbnails = thumbnails;
    this.owner = owner;
  }
}

export default class ProductFileManager {
  constructor(path) {
    this.__path = path;
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
    if (!fs.existsSync(this.__path))
      await fs.promises.writeFile(this.__path, "[]");
    if (fs.existsSync(this.__path)) {
      const products = JSON.parse(
        await fs.promises.readFile(this.__path, "utf-8")
      );

      //Filter:
      let filteredProducts = products.filter((product) => {
        return (
          product.title.includes(title) &&
          product.code.includes(code) &&
          product.description.includes(description) &&
          product.category.includes(category) &&
          (price === undefined || !isNaN(price) || product.price === +price) &&
          (stock === undefined || !isNaN(stock) || product.stock === +stock) &&
          (status === undefined ||
            !status ||
            product.status === Boolean(status))
        );
      });

      //Sort
      if (sort === "desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else {
        filteredProducts.sort((a, b) => a.price - b.price);
      }

      //Paginate
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      const totalPages = Math.ceil(filteredProducts.length / limit);

      let response = {
        docs: paginatedProducts,
        totalDocs: filteredProducts.length,
        limit,
        totalPages,
        page,
        hasPrevPage: page === 1 ? false : true,
        hasNextPage: page >= totalPages ? false : true,
        prevPage: page === 0 ? false : page - 1,
        nextPage: page >= totalPages ? false : page + 1,
      };
      return response;
    }
  };

  getProductById = async (pid) => {
    const id = +pid;
    if (isNaN(id) || (!isNaN(id) && id < 1)) {
      throw new BadRequestError("Debe especificar un id numérico");
    }

    const paginateProducts = await this.getProducts();
    const products = paginateProducts.docs;
    let product = products.find((p) => p?.id === +id);
    return product;
  };

  productWithAllProperties = (product) => {
    let properties = Object.keys(new Product());
    let productProperties = Object.keys(product);
    let missingProps = [];
    properties.forEach(
      (p) => productProperties.includes(p) || missingProps.push(p)
    );

    return missingProps.length > 0 && missingProps;
  };

  productHaveRequiredProps = (product) => {
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
  };

  addProduct = async (newProduct) => {
    newProduct = new Product(
      newProduct.code,
      newProduct.title,
      newProduct.description,
      newProduct.price,
      newProduct.status,
      newProduct.stock,
      newProduct.category,
      newProduct.thumbnails,
      newProduct.owner
    );
    //Verificamos si el producto tenga todas la propiedades
    let missingProps = this.productWithAllProperties(newProduct);
    if (missingProps)
      throw new BadRequestError(
        `The produsct doesn't have all properties. The following properties are missing: ${missingProps.join(
          ", "
        )}`
      );

    //Verificar que las propiedades requeridas tengan valor
    let propSinValor = this.productHaveRequiredProps(newProduct);
    if (propSinValor)
      throw new BadRequestError(
        `The following properties can't be empty: ${propSinValor.join(", ")}`
      );

    let paginateProducts = await this.getProducts();
    let products = paginateProducts.docs;

    //Verificamos que no se repita el codigo
    let repeatedCode = products?.some((p) => p?.code === newProduct?.code);
    if (repeatedCode) throw new BadRequestError("Repeated Code");

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
  };

  updateProduct = async (id, productToUpdate) => {
    id = +id;
    let paginateProducts = await this.getProducts();
    let products = paginateProducts.docs;

    //Verificar si id es numerico
    if (id === undefined || isNaN(id))
      throw new BadRequestError("id must be positive number");
    else if (!products.some((p) => p?.id === id))
      throw new NotFoundError("Not found");

    //Verificar cada propiedad de productToUpdate conincida
    productToUpdate = new Product(
      productToUpdate.code,
      productToUpdate.title,
      productToUpdate.description,
      productToUpdate.price,
      productToUpdate.status,
      productToUpdate.stock,
      productToUpdate.category,
      productToUpdate.thumbnails,
      productToUpdate.owner
    );
    let missingProps = this.productWithAllProperties(productToUpdate);
    if (missingProps)
      throw new BadRequestError(
        `The produsct doesn't have all properties. The following properties are missing: ${missingProps.join(
          ", "
        )}`
      );

    //Verificar existencias de las prop obligatorias
    let propSinValor = this.productHaveRequiredProps(productToUpdate);
    if (propSinValor)
      throw new BadRequestError(
        `The following properties can't be empty: ${propSinValor.join(", ")}`
      );

    //Verificar que no se repita el code
    let repeatedCode = products.some(
      (p) => p.id !== id && p.code === productToUpdate.code
    );
    if (repeatedCode) throw new BadRequestError("Repeated Code");

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
  };

  deleteProduct = async (id) => {
    id = +id;
    let paginateProducts = await this.getProducts();
    let products = paginateProducts.docs;

    //Verificar si id es numerico
    if (isNaN(id)) throw new BadRequestError("El id deber ser numérico");
    else if (!products.some((p) => p?.id === id))
      throw new NotFoundError("Not found");

    //Eliminamos
    let deletedProduct = products.find((p) => p?.id === id);
    let newProducts = products.filter((p) => p?.id !== id);
    await fs.promises.writeFile(
      this.__path,
      JSON.stringify(newProducts, null, "\t")
    );

    return deletedProduct;
  };

  validateProductsArray = async (products) => {
    let result = true;
    for (const p of products) {
      if (!(await this.getProductById(p.product))) result = false;
    }
    return result;
  };

  validateOwnerOfProductsArray = async (products, user) => {
    let result = true;
    for (const p of products) {
      let productExists = await this.getProductById(p.product);
      if (!productExists || productExists.owner === user.id) result = false;
    }

    return result;
  };
}

/******************* TEST ***************************/
// const prueba = async () => {
// let pm = new ProductManager("../data/products.json");
// console.log(await pm.getProductById(1));
// let newProduct = new Product(
//   "cod 1",
//   "prod editado 12",
//   "desc editado 1",
//   4000,
//   false,
//   4,
//   "Velas editado"
// );
// console.log(await pm.addProduct(newProduct));
// console.log(await pm.updateProduct(4, newProduct));
// console.log(await pm.deleteProduct(4))
// };

// prueba();
