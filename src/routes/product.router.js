import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { uploader } from "../utils.js";
import { authRole } from "../middlewares/middlewares.js";

class ProductRouter {
  constructor() {
    this.inicioProduct = Router();
    this.inicioProduct.get("/", productController.getProducts);
    this.inicioProduct.get("/:pid", productController.getProductById);
    this.inicioProduct.post(
      "/",
      authRole(["admin"]),
      uploader.array("thumbnails", 10),
      productController.createProduct
    );
    this.inicioProduct.put(
      "/:pid",
      authRole(["admin"]),
      uploader.array("thumbnails", 10),
      productController.updateProduct
    );
    this.inicioProduct.delete(
      "/:pid",
      authRole(["admin"]),
      productController.deleteProduct
    );
  }

  getRouter() {
    return this.inicioProduct;
  }
}

export default new ProductRouter();
