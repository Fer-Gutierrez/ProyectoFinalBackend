import express from "express";
import productService from "../services/product.service.js";
import cartService from "../services/cart.service.js";
import { userCookieExtractor } from "../middlewares/middlewares.js";

const router = express.Router();
// const productService = new ProductDbManager();
// const cartService = new CartDbManager();

//HOME:
router.get("/", userCookieExtractor, (req, res) => {
  if (req.session?.counter) {
    req.session.counter++;
  } else {
    req.session.counter = 1;
    res.redirect("/login");
  }

  res.render("home", {
    title: "Home",
    user: req.session?.user || req.user,
  });
});

//REAL TIME PRODUCTS:
router.get("/realtimeproducts", userCookieExtractor, (req, res) => {
  res.render("realTimeProducts", {
    title: "Real Time Producst",
    user: req.session?.user || req.user,
  });
});

//CHAT
router.get("/chat", userCookieExtractor, (req, res) => {
  res.render("chat", {
    title: "Chat",
    styles: "css/styles.css",
    user: req.session?.user || req.user,
  });
});

//PRODUCTS WITH PAGINATE
router.get("/products", userCookieExtractor, (req, res) => {
  res.render("products", {
    title: "Products with paginate",
    styles: "css/productsStyles.css",
    user: req.session?.user || req.user,
  });
});

//PRODUCT DETAIL
router.get("/product/:pid", userCookieExtractor, async (req, res) => {
  let id = req.params.pid;
  let product = await productService.getProductById(id);
  product = { ...product._doc, _id: product._id.toString() };
  res.render("productDetail", {
    title: "Product Detail",
    styles: "css/productsDetailStyles.css",
    product,
    user: req.session?.user || req.user,
  });
});

//CART DETAIL
router.get("/carts/:cid", userCookieExtractor, async (req, res) => {
  let cartId = req.params.cid;

  let cart = await cartService.getCartById(cartId);
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
    user: req.session?.user || req.user,
  });
});

//REGISTER:
router.get("/register", (req, res) => {
  res.render("register", {
    title: "Resgister",
  });
});

//LOGIN:
router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

export default router;
