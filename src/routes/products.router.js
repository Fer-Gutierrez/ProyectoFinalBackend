import { Router } from "express";
import { ProductManager } from "../manager/products.js";
import __dirname from "../utils.js";

const router = Router();
const productManager = new ProductManager(`${__dirname}/data/products.json`);

router.get("/", async (req, res) => {
  try {
    let products = await productManager.getProducts();

    let limit = req.query.limit;
    if (!limit) res.send({ products });
    else if (isNaN(limit) || (!isNaN(limit) && limit <= 0))
      res
        .status(400)
        .send({ status: "error", error: "limit must be a positive number" });
    else {
      products.splice(limit);
      res.send({ products });
    }
  } catch (err) {
    res.status(500).send({ status: "error", err });
  }
});

router.get("/:pid", async (req, res) => {
  let id = req.params.pid;

  try {
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
      else res.send({ product });
    }
  } catch (err) {
    res.status(500).send({ status: "error", err });
  }
});

router.post("/", async (req, res) => {
  let newPrroduct = req.body;
  let result = await productManager.addProduct(newPrroduct);
  try {
    if (Object.keys(result).includes("error"))
      res
        .status(404)
        .send({ status: "error", error: Object.values(result)[0] });
    else res.send({ result });
  } catch (err) {
    res.status(500).send({ status: "error", err });
  }
});

router.put("/:pid", async (req, res) => {
  let id = req.params.pid;
  let porductToUpdate = req.body;

  try {
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
          message: "Product updated",
          productUpdated: result,
        });
    }
  } catch (err) {
    res.status(500).send({ status: "error", err });
  }
});

router.delete("/:pid", async (req, res) => {
  let id = req.params.pid;
  try {
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
          message: "Deleted product",
          deletedProduct: result,
        });
    }
  } catch (err) {
    res.status(500).send({ status: "error", err });
  }
});

export default router;
