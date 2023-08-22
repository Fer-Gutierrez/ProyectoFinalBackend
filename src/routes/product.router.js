import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { generateCustomResponses, uploader } from "../utils.js";

class ProductRouter {
  constructor() {
    this.inicioProduct = Router();
    this.inicioProduct.get("/",generateCustomResponses, productController.getProducts);
    this.inicioProduct.get("/:pid",generateCustomResponses, productController.getProductById);
    this.inicioProduct.post("/",generateCustomResponses, uploader.array("thumbnails", 10), productController.createProduct);
    this.inicioProduct.put("/:pid",generateCustomResponses, uploader.array("thumbnails", 10), productController.updateProduct);
    this.inicioProduct.delete("/:pid",generateCustomResponses, productController.deleteProduct);
  }

  getRouter(){
    return this.inicioProduct;
  }
}

export default new ProductRouter();
