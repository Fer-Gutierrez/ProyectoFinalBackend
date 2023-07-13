import fs from "fs";

export class Product {
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

export class ProductFileManager {
  constructor(path) {
    this.__path = path;
  }

  getProducts = async () => {
    if (!fs.existsSync(this.__path))
      await fs.promises.writeFile(this.__path, "[]");
    if (fs.existsSync(this.__path)) {
      const products = await fs.promises.readFile(this.__path, "utf-8");
      return JSON.parse(products);
    }
  };

  getProductById = async (id) => {
    if (isNaN(id) || (!isNaN(id) && id < 1)) {
      return { error: "Debe especificar un id numérico" };
    }

    const products = await this.getProducts();
    let product = products.find((p) => p?.id === id);
    return product || { error: "Not found" };
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
    //Verificamos si el producto tenga todas la propiedades
    let missingProps = this.productWithAllProperties(newProduct);
    if (missingProps) {
      return {
        error: `The produsct doesn't have all properties. The following properties are missing: ${missingProps.join(
          ", "
        )}`,
      };
    }

    //Verificar que las propiedades requeridas tengan valor
    let propSinValor = this.productHaveRequiredProps(newProduct);
    if (propSinValor) {
      return {
        error: `The following properties can't be empty: ${propSinValor.join(
          ", "
        )}`,
      };
    }

    let products = await this.getProducts();

    //Verificamos que no se repita el codigo
    let repeatedCode = products?.some((p) => p?.code === newProduct?.code);
    if (repeatedCode) return { error: "Repeted Code" };

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
    let products = await this.getProducts();

    //Verificar si id es numerico
    if (isNaN(id)) return { error: "id must be positive number" };
    else if (!products.some((p) => p?.id === id)) return { error: "Not Found" };

    //Verificar cada propiedad de productToUpdate conincida
    let missingProps = this.productWithAllProperties(productToUpdate);
    if (missingProps) {
      return {
        error: `The produsct doesn't have all properties. The following properties are missing: ${missingProps.join(
          ", "
        )}`,
      };
    }

    //Verificar existencias de las prop obligatorias
    let propSinValor = this.productHaveRequiredProps(productToUpdate);
    if (propSinValor) {
      return {
        error: `The following properties can't be empty: ${propSinValor.join(
          ", "
        )}`,
      };
    }

    //Verificar que no se repita el code
    let repeatedCode = products.some(
      (p) => p.id !== id && p.code === productToUpdate.code
    );
    if (repeatedCode) return { error: "Repeated Code" };

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
    let products = await this.getProducts();

    //Verificar si id es numerico
    if (isNaN(id)) return { error: "El id deber ser numérico" };
    else if (!products.some((p) => p?.id === id)) return { error: "Not Found" };

    //Eliminamos
    let deletedProduct = products.find((p) => p?.id === id);
    let newProducts = products.filter((p) => p?.id !== id);
    await fs.promises.writeFile(
      this.__path,
      JSON.stringify(newProducts, null, "\t")
    );

    return deletedProduct;
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
