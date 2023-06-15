import { Router } from "express";
import { Product, ProductManager } from "../manager/products.js";
import __dirname, { uploader } from "../utils.js";

const router = Router();
const productManager = new ProductManager(`${__dirname}/data/products.json`);

router.get("/", async (req, res) => {
  try {
    let products = await productManager.getProducts();

    let limit = req.query.limit;
    if (!limit) res.send({ products });
    else if (isNaN(limit) || (!isNaN(limit) && +limit <= 0))
      res
        .status(400)
        .send({ status: "error", error: "limit must be a positive number" });
    else {
      products.splice(limit);
      res.send({ status: "Ok", data: products });
    }
  } catch (err) {
    res.status(500).send({ status: "error", err });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    if (isNaN(id) || +id <= 0)
      res
        .status(400)
        .send({ status: "error", error: "pid must be a positive number" });
    else {
      let product = await productManager.getProductById(+id);
      if (Object.keys(product).includes("error"))
        res
          .status(404)
          .send({ status: "error", error: Object.values(product)[0] });
      else res.send({ status: "Ok", data: product });
    }
  } catch (err) {
    res.status(500).send({ status: "error", err });
  }
});

router.post("/", uploader.array("thumbnails", 10), async (req, res) => {
  try {
    const files = req.files;
    let newProduct = new Product(
      req.body.code,
      req.body.title,
      req.body.description,
      req.body.price,
      req.body.status,
      req.body.stock,
      req.body.category,
      files ? files.map((f) => f.path) : []
    );

    let result = await productManager.addProduct(newProduct);
    if (Object.keys(result).includes("error"))
      res
        .status(404)
        .send({ status: "error", error: Object.values(result)[0] });
    else res.send({ status: "OK", message: "Product was added", data: result });
  } catch (err) {
    res.status(500).send({ status: "error", err });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    let porductToUpdate = req.body;
    if (isNaN(id) || +id <= 0)
      res
        .status(400)
        .send({ status: "error", error: "pid must be a positive number" });
    else {
      let result = await productManager.updateProduct(+id, porductToUpdate);
      if (Object.keys(result).includes("error"))
        res
          .status(404)
          .send({ status: "error", error: Object.values(result)[0] });
      else
        res.send({
          status: "OK",
          message: "Product was updated",
          data: result,
        });
    }
  } catch (err) {
    res.status(500).send({ status: "error", err });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    if (isNaN(id) || +id <= 0)
      res
        .status(400)
        .send({ status: "error", error: "pid must be a positive number" });
    else {
      let result = await productManager.deleteProduct(+id);
      if (Object.keys(result).includes("error"))
        res
          .status(404)
          .send({ status: "error", error: Object.values(result)[0] });
      else
        res.send({
          status: "OK",
          message: "Product was deleted",
          data: result,
        });
    }
  } catch (err) {
    res.status(500).send({ status: "error", err });
  }
});

export default router;
