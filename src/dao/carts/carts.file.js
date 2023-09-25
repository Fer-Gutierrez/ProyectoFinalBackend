import fs from "fs";
import ProductFileManager from "../products/products.file.js";
import __dirname from "../../utils.js";
import { BadRequestError, NotFoundError } from "../../exceptions/exceptions.js";

export class Cart {
  constructor() {
    this.id = undefined;
    this.products = [];
  }
}

export default class CartFileManager {
  constructor(path) {
    this.__path = path;
  }

  getCarts = async () => {
    try {
      if (!fs.existsSync(this.__path))
        await fs.promises.writeFile(this.__path, "[]");
      if (fs.existsSync(this.__path)) {
        let carts = await fs.promises.readFile(this.__path, "utf-8");
        return JSON.parse(carts);
      }
    } catch (error) {
      throw new Error(
        `Error to try getCarts (File persistence): ${error.message}`
      );
    }
  };

  getCartById = async (cid) => {
    const id = +cid;
    try {
      //Verificamos si el id es numerico
      if (isNaN(id) || (!isNaN(id) && id < 1)) {
        throw new BadRequestError("El  id del carrito debe ser numérico");
      }

      let carts = await this.getCarts();
      let selectedCart = carts.find((c) => c.id === +id);
      if (!selectedCart) throw new NotFoundError(`Cart (${id}) not found.`);
      return selectedCart;
    } catch (error) {
      throw error;
    }
  };

  cartWithAllProperties = (cart) => {
    try {
      let properties = Object.keys(new Cart());
      let cartProperties = Object.keys(cart);
      let missingProperties = [];
      properties.forEach(
        (p) => cartProperties.includes(p) || missingProperties.push(p)
      );

      return missingProperties.length > 0 && missingProperties;
    } catch (error) {
      throw new Error(
        `Error to try cartWithAllProperties (File persistence): ${error.message}`
      );
    }
  };

  addCart = async (newCart) => {
    try {
      newCart = new Cart();
      //Asignamos el id
      let carts = await this.getCarts();
      carts.length === 0
        ? (newCart.id = 1)
        : (newCart.id = carts[carts?.length - 1].id + 1);

      //Agregamos cart
      carts.push(newCart);
      fs.promises.writeFile(this.__path, JSON.stringify(carts, null, "\t"));
      return newCart;
    } catch (error) {
      throw new Error(
        `Error to try addCart (File persistence): ${error.message}`
      );
    }
  };

  addProductToCart = async (cartId, productId) => {
    try {
      //Verificamos si los id son numericos y positivos
      if (isNaN(cartId) || (!isNaN(cartId) && cartId <= 0))
        return { error: "Cart id property must be a positive number" };
      if (isNaN(productId) || (!isNaN(productId) && productId <= 0))
        return { error: "Product Id property must be a positive number" };

      //Verificamos si existe carrito
      let cartToEdit = await this.getCartById(+cartId);
      if (!cartToEdit) throw new NotFoundError("Cart not found");

      //Verificamos si existe producto
      let mp = new ProductFileManager(`${__dirname}/data/products.json`);
      let product = await mp.getProductById(+productId);
      if (!product) throw new NotFoundError("Product not found");

      //Agregamos el producto al carrito
      let productExistInCart = cartToEdit?.products.some(
        (p) => p?.productId === +productId
      );
      if (productExistInCart) {
        cartToEdit.products = cartToEdit.products.map((p) =>
          p?.productId === +productId ? { ...p, quantity: p?.quantity + 1 } : p
        );
      } else {
        cartToEdit.products.push({ productId: product.id, quantity: 1 });
      }

      //Actualizamos la lista de carritos
      let carts = await this.getCarts();
      let newCarts = carts.map((c) =>
        c.id === cartToEdit.id ? cartToEdit : c
      );

      //Actualizamos el archivo
      fs.promises.writeFile(this.__path, JSON.stringify(newCarts, null, "\t"));
      return cartToEdit;
    } catch (error) {
      throw error;
    }
  };

  existCart = async (cartId) => {
    try {
      return await this.getCartById(cartId);
    } catch (error) {
      throw new Error(
        `Error to try existCart (File persistence): ${error.message}`
      );
    }
  };

  existProductInCart = async (cartId, productId) => {
    try {
      let cart = await this.getCartById(cartId);
      return cart.products.some((p) => p.productId === +productId);
    } catch (error) {
      throw new Error(
        `Error to try existProductInCart (File persistence): ${error.message}`
      );
    }
  };

  removeProductInCart = async (cartId, productId) => {
    try {
      if (!(await this.existCart(cartId)))
        throw new NotFoundError("Carrito no existe");

      let newListCarts = [];
      let listCarts = await this.getCarts();
      listCarts.forEach((c) => {
        if (c.id === +cartId) {
          let newListProducts = c.products.filter(
            (p) => p.productId !== +productId
          );
          c.products = newListProducts;
        }
        newListCarts.push(c);
      });

      fs.promises.writeFile(
        this.__path,
        JSON.stringify(newListCarts, null, "\t")
      );
      return newListCarts;
    } catch (error) {
      throw error;
    }
  };

  updateProductsInCart = async (cartId, products) => {
    try {
      let newListCarts = [];
      let listCarts = await this.getCarts();
      listCarts.forEach((c) => {
        if (c.id === +cartId) {
          c.products = products;
        }
        newListCarts.push(c);
      });

      fs.promises.writeFile(
        this.__path,
        JSON.stringify(newListCarts, null, "\t")
      );
      return newListCarts;
    } catch (error) {
      throw new Error(
        `Error to try updateProductsInCart (File persistence): ${error.message}`
      );
    }
  };

  updateQuantityProductInCart = async (cartId, productId, quantity) => {
    try {
      let newListCarts = [];
      let listCarts = await this.getCarts();
      listCarts.forEach((c) => {
        if (c.id === +cartId) {
          c.products.forEach((p) => {
            if (p.productId === +productId) {
              p.quantity += +quantity;
            }
          });
        }
        newListCarts.push(c);
      });

      fs.promises.writeFile(
        this.__path,
        JSON.stringify(newListCarts, null, "\t")
      );
      return newListCarts;
    } catch (error) {
      throw new Error(
        `Error to try updateQuantityProductInCart (File persistence): ${error.message}`
      );
    }
  };

  removeAllProductsInCart = async (cartId) => {
    try {
      if (!(await this.existCart(+cartId)))
        throw new NotFoundError("Carrito no existe");

      let newListCarts = [];
      let listCarts = await this.getCarts();
      listCarts.forEach((c) => {
        if (c.id === +cartId) {
          c.products = [];
        }
        newListCarts.push(c);
      });

      fs.promises.writeFile(
        this.__path,
        JSON.stringify(newListCarts, null, "\t")
      );
      return newListCarts;
    } catch (error) {
      throw error;
    }
  };
}

/******************* TEST ***************************/
// const prueba = async () => {
//   const cm = new CartManager("../data/carts.json");
//   console.log(await cm.getCarts());
//   let cart1 = new Cart();
//   console.log(await cm.addCart(cart1));

//   console.log(await cm.addProductToCart(2, 1));
// };

// prueba()
