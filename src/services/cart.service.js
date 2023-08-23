import cartModel from "../dao/models/carts.model.js";
import productsService from "./product.service.js";
import fs from "fs";
import __dirname from "../utils.js";

class CartService {
  constructor(path) {
    this.__path = path;
  }

  getCarts = async () => {
    try {
      let carts = await cartModel.find().populate("products.product").lean();
      return carts;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getCartById = async (id) => {
    try {
      let cart = await cartModel
        .findOne({ _id: id })
        .populate("products.product");

      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  addCart = async (newCart) => {
    try {
      let result = await cartModel.create(newCart);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  addProductToCart = async (cartId, productId) => {
    try {
      let existProductInCart = await this.existProductInCart(cartId, productId);
      if (existProductInCart) {
        return await this.updateQuantityProductInCart(cartId, productId, 1);
      }

      let cart = await cartModel.findOne({ _id: cartId });
      cart.products.push({ product: productId });

      let result = await cartModel.updateOne({ _id: cartId }, cart, {
        runValidators: true,
      });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  existCart = async (cartId) => {
    try {
      let result = await cartModel.findOne({ _id: cartId });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  existProductInCart = async (cartId, productId) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      let result = cart.products.some(
        (p) => p.product.toString() === productId
      );
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  removeProductInCart = async (cartId, productId) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      const productIdExistsInCart = cart.products.some(
        (p) => p.product.toString() === productId
      );
      if (!productIdExistsInCart)
        throw new Error(
          `The productId (${productId}) doesnt exist in Cart ${cartId}`
        );
      let newListProducts = cart.products.filter(
        (p) => p.product.toString() !== productId
      );

      cart.products = newListProducts;

      let result = cartModel.updateOne({ _id: cartId }, cart, {
        runValidators: true,
      });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateProductsInCart = async (cartId, products) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      cart.products = products;
      let result = await cartModel.updateOne({ _id: cartId }, cart, {
        runValidators: true,
      });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateQuantityProductInCart = async (cartId, productId, quantity) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      let productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      cart.products[productIndex].quantity += quantity;
      let result = await cartModel.updateOne({ _id: cartId }, cart, {
        runValidators: true,
      });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  removeAllProductsInCart = async (cartId) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      cart.products = [];
      let result = await cartModel.updateOne({ _id: cartId }, cart, {
        runValidators: true,
      });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  //File Carts:
  getFileCarts = async () => {
    try {
      if (!fs.existsSync(this.__path))
        await fs.promises.writeFile(this.__path, "[]");
      if (fs.existsSync(this.__path)) {
        let carts = await fs.promises.readFile(this.__path, "utf-8");
        return JSON.parse(carts);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getFileCartById = async (id) => {
    try {
      //Verificamos si el id es numerico
      if (isNaN(id) || (!isNaN(id) && id < 1))
        throw new Error("The id must be positive number");

      let carts = await this.getFileCarts();
      let selectedCart = carts.find((c) => c?.id === id);
      if (!selectedCart) throw new Error("Not found");
      return selectedCart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  fileCartWithAllProperties = (cart) => {
    try {
      let properties = Object.keys(new Cart());
      let cartProperties = Object.keys(cart);
      let missingProperties = [];
      properties.forEach(
        (p) => cartProperties.includes(p) || missingProperties.push(p)
      );

      if (missingProperties.length > 0) return missingProperties;
      throw new Error(
        "error inesperado al controlar las propiedade del carrito."
      );
    } catch (error) {
      throw new Error(error.message);
    }
  };

  addFileCart = async (newCart) => {
    try {
      //Verificamos que cart tenga las propiedades del objeto
      let missingProps = this.fileCartWithAllProperties(newCart);
      if (missingProps)
        throw new Error(
          `The cart doesn't have all properties.The following properties are missing: ${missingProps.join(
            ", "
          )}`
        );

      //Asignamos el id
      let carts = await this.getFileCarts();
      carts.length === 0
        ? (newCart.id = 1)
        : (newCart.id = carts[carts?.length - 1].id + 1);

      //Agregamos cart
      carts.push(newCart);
      fs.promises.writeFile(this.__path, JSON.stringify(carts, null, "\t"));
      return newCart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  addFileProductToFileCart = async (cartId, productId) => {
    try {
      //Verificamos si los id son numericos y positivos
      if (isNaN(cartId) || (!isNaN(cartId) && cartId <= 0))
        throw new Error("Cart id property must be a positive number");
      if (isNaN(productId) || (!isNaN(productId) && productId <= 0))
        throw new Error("Product Id property must be a positive number");

      //Verificamos si existe carrito
      let cartToEdit = await this.getFileCartById(cartId);
      if (Object.keys(cartToEdit).includes("error"))
        throw new Error("Cart not found");

      //Verificamos si existe producto
      let product = await productsService.getFileProductById(productId);
      if (Object.keys(product).includes("error"))
        throw new Error("Product not found");

      //Agregamos el producto al carrito
      let productExistInCart = cartToEdit?.products.some(
        (p) => p?.productId === productId
      );
      if (productExistInCart) {
        cartToEdit.products = cartToEdit.products.map((p) =>
          p?.productId === productId ? { ...p, quantity: p?.quantity + 1 } : p
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
      await fs.promises.writeFile(
        this.__path,
        JSON.stringify(newCarts, null, "\t")
      );
      return cartToEdit;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default new CartService(`${__dirname}/data/products.json`);

class Cart {
  constructor() {
    this.id = undefined;
    this.products = [];
  }
}
