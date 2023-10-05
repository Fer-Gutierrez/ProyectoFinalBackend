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
        owner: req.user?.id,
      });
      req.logger.info(`Producto con code: ${code} agregado con éxito.`);
      await sendProductsSocket();
      req.logger.info(`Se envió el producto a traves del socket.`);
      res.sendSuccess({ message: "Product was added.", data: result });
    } catch (error) {
      res.sendError({ message: error.message }, error.status);
    }
  }

  async getProducts(req, res, next) {
    try {
      const {
        limit,
        page,
        sort,
        title,
        code,
        description,
        price,
        stock,
        status,
        category,
      } = req.query;

      let result = await productService.getProducts(
        title,
        code,
        description,
        category,
        price && Number(price),
        stock && Number(stock),
        status,
        page || 1,
        limit || 10,
        sort
      );
      req.logger.info(
        `Se obtuvo la lista de productos desde la base de datos.`
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
      req.logger.info(`Se responde la lista de productos paginada.`);

      res.sendSuccess(response);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      let id = req.params.pid;
      let product = await productService.getProductById(id);
      req.logger.info(`Se obtuvo el producto con id ${id}.`);
      req.logger.info(`Se responde el producto con id ${id}.`);
      res.sendSuccess(product);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
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

      let result = await productService.updateProduct(id, {
        code,
        title,
        description,
        price,
        status,
        stock,
        category,
        thumbnails: files ? files.map((f) => f.path) : [],
        owner: req.user?.id,
      });
      req.logger.info(`Se actualiozó el producto con id ${id}.`);
      await sendProductsSocket();
      req.logger.info(
        `Se envio la lista actualizada de productos a traves del socket.`
      );
      res.sendSuccess({ message: "Product was updated.", data: result });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      let id = req.params.pid;
      let user = req.user;
      let result = await productService.deleteProduct(id, user);
      req.logger.info(`Se eliminó el producto con id ${id}.`);
      await sendProductsSocket();
      req.logger.info(
        `Se envio la lista de productos actualizada a traves del socket.`
      );
      res.sendSuccess({ message: "Product was deleted", data: result });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();

const sendProductsSocket = async () => {
  try {
    const result = await productService.getProducts();
    socketServer.emit(
      "refreshListProducts",
      JSON.stringify(result, null, "\t")
    );
  } catch (error) {
    throw error;
  }
};
