import { Router } from "express";
import __dirname, { uploader } from "../utils.js";
import { socketServer } from "../app.js";
import ProductDbManager from "../dao/dbManager/products.js";

const router = Router();
const productDbManager = new ProductDbManager();

router.get("/", async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      title,
      code,
      description,
      price,
      stock,
      status,
      category,
    } = req.query;

    if (isNaN(limit) || (!isNaN(limit) && +limit <= 0))
      return res
        .status(400)
        .send({ status: "errors", error: "limit must be a positive number" });

    if (isNaN(page) || (!isNaN(page) && +page <= 0))
      return res
        .status(400)
        .send({ status: "errors", error: "page must be a positive number" });

    if (
      sort !== undefined &&
      sort.toLowerCase() !== "asc" &&
      sort.toLowerCase() !== "desc"
    )
      return res
        .status(400)
        .send({ status: "errors", error: "sort must be a 'asc' or 'desc'" });

    if (status !== undefined && Number(status) !== 1 && Number(status) !== 0)
      return res.status(400).send({
        status: "errors",
        error: "status must be a 1(true) or 0(false)",
      });

    if (price !== undefined && !isNaN(Number(price)) && Number(price) < 0)
      return res.status(400).send({
        status: "errors",
        error: "price must be 0 or a positive number",
      });

    if (stock !== undefined && !isNaN(Number(stock)) && Number(stock) < 0)
      return res.status(400).send({
        status: "errors",
        error: "stock must be 0 or a positive number",
      });

    let result = await productDbManager.getProducts(
      title,
      code,
      description,
      category,
      price && Number(price),
      stock && Number(stock),
      status,
      page,
      limit,
      sort
    );

   
    let prevLink = "";
    if (result.hasPrevPage) {
      let posInitialPage = req.url.indexOf("&page=");
      let url =
        posInitialPage !== -1 ? req.url.slice(0, posInitialPage) : req.url;
      prevLink = "api/products" + url + `&page=${result.prevPage}`;
    }

    let nextLink = "";
    if (result.hasNextPage) {
      let posInitialPage = req.url.indexOf("&page=");
      let url =
        posInitialPage !== -1 ? req.url.slice(0, posInitialPage) : req.url;
      nextLink = "api/products" + url + `&page=${result.nextPage}`;
    }

    let response = {
      status: "OK",
      payload: result.docs,
      totalRecords: result.totalDocs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
    };

    res.send({ status: "Ok", data: response });
  } catch (err) {
    res.status(500).send({ status: "Internal Server Error", err });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    let product = await productDbManager.getProductById(id);
    if (!product)
      return res
        .status(404)
        .send({ status: "Not found", message: "pid doesn't found" });
    if (Object.keys(product).includes("errors"))
      res
        .status(404)
        .send({ status: "Bad Request", error: Object.values(product)[0] });
    else res.send({ status: "Ok", data: product });
  } catch (err) {
    res.status(500).send({ status: "Internal Server Error", err });
  }
});

router.post("/", uploader.array("thumbnails", 10), async (req, res) => {
  try {
    const { code, title, description, price, status, stock, category, files } =
      req.body;

    let result = await productDbManager.addProduct({
      code,
      title,
      description,
      price,
      status,
      stock,
      category,
      thumbnails: files ? files.map((f) => f.path) : [],
    });

    if (Object.keys(result).includes("errors")) {
      return res
        .status(400)
        .send({ status: "Bad Request", error: Object.values(result)[0] });
    } else if (Object.keys(result).includes("keyValue")) {
      return res.status(400).send({
        status: "Bad Request",
        error: "Product wasn't added. Repeated Code.",
      });
    } else {
      res.send({ status: "OK", message: "Product was added", data: result });
      sendProductsSocket();
    }
  } catch (err) {
    res.status(500).send({ status: "Internal Server Error", err });
  }
});

router.put("/:pid", uploader.array("thumbnails", 10), async (req, res) => {
  try {
    const { code, title, description, price, status, stock, category, files } =
      req.body;

    let id = req.params.pid;
    let existProduct = await productDbManager.getProductById(id);
    if (!existProduct)
      return res
        .status(404)
        .send({ status: "Not found", message: "pid doesn't found" });

    let result = await productDbManager.updateProduct(id, {
      code,
      title,
      description,
      price,
      status,
      stock,
      category,
      thumbnails: files ? files.map((f) => f.path) : [],
    });

    if (Object.keys(result).includes("errors"))
      res
        .status(400)
        .send({ status: "Bad Request", error: Object.values(result)[0] });
    else if (!Object.keys(result).includes("modifiedCount"))
      res.status(400).send({
        status: "Bad Request",
        error: "Product wasn't update. Repeated Code.",
      });
    else
      res.send({
        status: "OK",
        message: "Product was updated",
        data: result,
      });
    sendProductsSocket();
  } catch (err) {
    res.status(500).send({ status: "Internal Server Error", err });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    let existProduct = await productDbManager.existProduct(id);
    if (!existProduct || existProduct.reason)
      return res
        .status(400)
        .send({ status: "Bad request", error: "Id doesn't exist." });

    let result = await productDbManager.deleteProduct(id);
    if (Object.keys(result).includes("errors"))
      res
        .status(404)
        .send({ status: "Bad Request", error: Object.values(result)[0] });
    else
      res.send({
        status: "OK",
        message: "Product was deleted",
        data: result,
      });
    sendProductsSocket();
  } catch (err) {
    res.status(500).send({ status: "Internal Server Error", err });
  }
});

const sendProductsSocket = async () => {
  socketServer.emit(
    "refreshListProducts",
    JSON.stringify(await productDbManager.getProducts(), null, "\t")
  );
};

export default router;

