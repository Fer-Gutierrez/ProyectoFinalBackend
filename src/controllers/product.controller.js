import { socketServer } from "../app.js";
import productService from "../services/product.service.js";

class ProductController {
  async createProduct(req, res) {
    try {
      const {
        code,
        title,
        description,
        price,
        status,
        stock,
        category,
        files,
      } = req.body;

      let result = await productService.addProduct({
        code,
        title,
        description,
        price,
        status,
        stock,
        category,
        thumbnails: files ? files.map((f) => f.path) : [],
      });

      await sendProductsSocket();
      res.sendSuccess({ message: "Product was added.", data: result });
    } catch (error) {
      res.sendError({ message: error.message });
    }
  }

  async getProducts(req, res) {
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
        return res.sendError(
          { message: "limit must be a positive number" },
          400
        );

      if (isNaN(page) || (!isNaN(page) && +page <= 0))
        return res.sendError(
          { message: "page must be a positive number" },
          400
        );

      if (
        sort !== undefined &&
        sort.toLowerCase() !== "asc" &&
        sort.toLowerCase() !== "desc"
      )
        return res.sendError(
          { message: "sort must be a 'asc' or 'desc'" },
          400
        );

      if (status !== undefined && Number(status) !== 1 && Number(status) !== 0)
        return res.sendError(
          { message: "status must be a 1(true) or 0(false)" },
          400
        );

      if (price !== undefined && !isNaN(Number(price)) && Number(price) < 0)
        return res.sendError(
          { message: "price must be 0 or a positive number" },
          400
        );

      if (stock !== undefined && !isNaN(Number(stock)) && Number(stock) < 0)
        return res.sendError(
          { message: "stock must be 0 or a positive number" },
          400
        );

      let result = await productService.getProducts(
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
        totalRecords: result.totalDocs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink,
        nextLink,
        data: result.docs,
      };

      res.sendSuccess(response);
    } catch (error) {
      res.sendError({ message: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      let id = req.params.pid;
      let product = await productService.getProductById(id);
      if (!product) return res.sendError({ message: "pid doesn't found" }, 404);
      res.sendSuccess(product);
    } catch (error) {
      res.sendError({ message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const {
        code,
        title,
        description,
        price,
        status,
        stock,
        category,
        files,
      } = req.body;

      let id = req.params.pid;
      let existProduct = await productService.getProductById(id);
      if (!existProduct)
        return res.sendError({ message: "pid doesn't found" }, 404);

      let result = await productService.updateProduct(id, {
        code,
        title,
        description,
        price,
        status,
        stock,
        category,
        thumbnails: files ? files.map((f) => f.path) : [],
      });

      sendProductsSocket();
      res.sendSuccess({ message: "Product was updated.", data: result });
    } catch (error) {
      console.log(error);
      res.sendError({ message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      let id = req.params.pid;
      let existProduct = await productService.existProduct(id);
      if (!existProduct || existProduct.reason)
        return res.sendError({ message: "Id doesn't exist." }, 404);

      let result = await productService.deleteProduct(id);
      await sendProductsSocket();
      res.sendSuccess({ message: "Product was deleted", data: result });
    } catch (error) {
      res.sendError({ message: error.message });
    }
  }
}

export default new ProductController();

const sendProductsSocket = async () => {
  const result = await productService.getProducts();
  console.log(result);
  socketServer.emit(
    "refreshListProducts",
    JSON.stringify(await productService.getProducts(), null, "\t")
  );
};
