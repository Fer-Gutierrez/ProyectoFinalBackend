import fs from "fs";
import { Product, ProductManager } from "./products.js";

export class Cart {
  constructor(products = []) {
    this.id = undefined;
    this.products = products;
  }
}

export class CartManager {
  constructor(path) {
    this.__path = path;
  }

  getCarts = async () => {
    if (!fs.existsSync(this.__path))
      await fs.promises.writeFile(this.__path, "[]");
    if (fs.existsSync(this.__path)) {
      let carts = await fs.promises.readFile(this.__path, "utf-8");
      return JSON.parse(carts);
    }
  };

  getCartById = async (id) => {
    //Verificamos si el id es numerico
    if (isNaN(id) || (!isNaN(id) && id < 1)) {
      return { error: "The id must be positive number" };
    }

    let carts = await this.getCarts();
    let selectedCart = carts.find((c) => c?.id === id);
    return selectedCart ? selectedCart : { error: "Not found" };
  };

  cartWithAllProperties = (cart) => {
    let properties = Object.keys(new Cart());
    let cartProperties = Object.keys(cart);
    let missingProperties = [];
    properties.forEach(
      (p) => cartProperties.includes(p) || missingProperties.push(p)
    );

    return missingProperties.length > 0 && missingProperties;
  };

  addCart = async (newCart) => {
    //Verificamos que cart tenga las propiedades del objeto
    let missingProps = this.cartWithAllProperties(newCart);
    if (missingProps) {
      return {
        error: `The cart doesn't have all properties.The following properties are missing: ${missingProps.join(
          ", "
        )}`,
      };
    }

    //Verificamos que existan los productos del cart
    const pm = new ProductManager();
    let products = await pm.getProducts();
    newCart.products.forEach((p) => {
      if (!products.includes(p?.id))
        return { error: "One of the products doesn't exist" };
      if (!Object.keys(p).includes("quantity"))
        return {
          error: "One of the products doesn't have the quantity property",
        };
    });

    let carts = await this.getCarts();

    //Asignamos el id
    console.log(carts);
    carts.length === 0
      ? (newCart.id = 1)
      : (newCart.id = carts[carts?.length - 1].id + 1);

    //Agregamos cart
    carts.push(newCart);
    fs.promises.writeFile(this.__path, JSON.stringify(carts, null, "\t"));
    return newCart;
  };

  addProductToCart = async (cartId, productId) => {
    //Verificamos si los id son numericos y positivos
    if (isNaN(cartId) || (!isNaN(cartId) && cartId <= 0))
      return { error: "Cart id property must be a positive number" };
    if (isNaN(productId) || (!isNaN(productId) && productId <= 0))
      return { error: "Product Id property must be a positive number" };

    //Verificamos si existe carrito
    let newCart = await this.getCartById(cartId);
    if (Object.keys(newCart).includes("error"))
      return { error: "Cart not found" };

    //Verificamos si existe producto
    let mp = new ProductManager();
    let product = await mp.getProductById(productId);
    if (Object.keys(product).includes("error"))
      return { error: "Product to add doesn't exist" };

    //Agregamos el producto al carrito
    let productExistInCart = newCart?.products.some((p) => p?.id === productId);
    if (productExistInCart) {
      newCart.products = newCart.products.map((p) =>
        p?.id === productId ? { ...p, quantity: p?.quantity + 1 } : p
      );
    } else {
      newCart.products.push({ ...product, quantity: 1 });
    }

    //Actualizamos la lista de carritos
    let carts = await this.getCarts();
    let newCarts = carts.map((c) => (c.id === newCart.id ? newCart : c));

    //Actualizamos el archivo
    fs.promises.writeFile(this.__path, JSON.stringify(newCarts, null, "\t"));
    return newCart;
  };
}

// const prueba = async () => {
//   const cm = new CartManager("../data/carts.json");
//   const pm = new ProductManager("../data/products.json");
//   console.log(await cm.getCarts());
//   const prod1 = new Product(
//     "cod1",
//     "producto 1",
//     "descripcion 1",
//     1000,
//     true,
//     11,
//     "Velas"
//   );
//   const prod2 = new Product(
//     "cod2",
//     "producto 2",
//     "descripcion 2",
//     2000,
//     true,
//     12,
//     "Mates"
//   );
// const prod3 = new Product(
//   "cod4",
//   "producto 4",
//   "descripcion 4",
//   4000,
//   true,
//   14,
//   "Ruedas"
// );
//   console.log(await pm.addProduct(prod1));
//   console.log(await pm.addProduct(prod2));
// console.log(await pm.addProduct(prod3));

// let product1 = await pm.getProductById(1);
// product1 = { ...product1, quantity: 1 };
// let product2 = await pm.getProductById(2);
// product2 = { ...product2, quantity: 1 };
// let product3 = await pm.getProductById(3);
// product3 = { ...product3, quantity: 1 };
// let product4 = await pm.getProductById(4);
// product4 = { ...product4, quantity: 1 };

// let cart1 = new Cart([product2, product3]);
// console.log(await cm.addCart(cart1));

//   console.log(await cm.addProductToCart(2, 1));
// };

// prueba();
