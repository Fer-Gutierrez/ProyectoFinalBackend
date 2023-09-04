import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { uploader } from "../utils.js";
import {
  generateCustomResponses,
  authRole,
} from "../middlewares/middlewares.js";

class ProductRouter {
  constructor() {
    this.inicioProduct = Router();
    this.inicioProduct.get(
      "/",
      generateCustomResponses,
      productController.getProducts
    );
    this.inicioProduct.get(
      "/:pid",
      generateCustomResponses,
      productController.getProductById
    );
    this.inicioProduct.post(
      "/",
      generateCustomResponses,
      authRole(["admin"]),
      uploader.array("thumbnails", 10),
      productController.createProduct
    );
    this.inicioProduct.put(
      "/:pid",
      generateCustomResponses,
      authRole(["admin"]),
      uploader.array("thumbnails", 10),
      productController.updateProduct
    );
    this.inicioProduct.delete(
      "/:pid",
      generateCustomResponses,
      authRole(["admin"]),
      productController.deleteProduct
    );
  }

  getRouter() {
    return this.inicioProduct;
  }
}

export default new ProductRouter();
