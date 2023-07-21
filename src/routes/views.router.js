import express from "express";
import ProductDbManager from "../dao/dbManager/products.js";
import CartDbManager from "../dao/dbManager/carts.js";

const router = express.Router();
const productDbManager = new ProductDbManager();
const cartDbManager = new CartDbManager();

//HOME:
router.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
  });
});

//REAL TIME PRODUCTS:
router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    title: "Real Time Producst",
  });
});

//CHAT
router.get("/chat", (req, res) => {
  res.render("chat", {
    title: "Chat",
    styles: "css/styles.css",
  });
});

//PRODUCTS CON PAGINATE
router.get("/products", (req, res) => {
  res.render("products", {
    title: "Products with paginate",
    styles: "css/productsStyles.css",
  });
});

//PRODUCT DETAIL
router.get("/product/:pid", async (req, res) => {
  let id = req.params.pid;
  let product = await productDbManager.getProductById(id);
  product = { ...product._doc, _id: product._id.toString() };
  res.render("productDetail", {
    title: "Product Detail",
    styles: "css/productsDetailStyles.css",
    product,
  });
});

//CART DETAIL
router.get("/carts/:cid", async (req, res) => {
  let cartId = req.params.cid;

  let cart = await cartDbManager.getCartById(cartId);
  cart = { ...cart._doc, _id: cart._id.toString() };

  let newListProductsInCart = [];
  cart.products.forEach((p) => {
    newListProductsInCart.push({
      _id: p._id.toString(),
      quantity: p.quantity,
      product: { ...p.product._doc, _id: p.product._id.toString() },
    });
  });
  cart.products = newListProductsInCart;

  res.render("cartDetail", {
    title: "Product Detail",
    styles: "css/productsDetailStyles.css",
    cart,
  });
});

export default router;
