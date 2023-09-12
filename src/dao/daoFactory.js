import { CONFIG } from "../config/config.js";
import CartFileManager from "./carts/carts.file.js";
import CartDbManager from "./carts/carts.mongo.js";
import ProductDbManager from "./products/products.mongo.js";
import ProductFileManager from "./products/products.file.js";
import UserDbManager from "./users/users.mongo.js";
import TicketFileManager from "./tickets/tickets.file.js";
import TicketDbManager from "./tickets/tickets.mongo.js";
import __dirname from "../utils.js";

class FactoryDAO {
  constructor() {
    switch (CONFIG.PERSISTENCE_TYPE) {
      case "file": {
        this._cartManager = new CartFileManager(`${__dirname}/data/carts.json`);
        this._productManager = new ProductFileManager(
          `${__dirname}/data/products.json`
        );
        this._ticketManager = new TicketFileManager(
          `${__dirname}/data/tickets.json`
        );
        break;
      }
      case "mongo": {
        this._cartManager = new CartDbManager();
        this._productManager = new ProductDbManager();
        this._ticketManager = new TicketDbManager();
        break;
      }
      default: {
        throw new Error("No se estableció una persistencia valida");
      }
    }
    this._userManager = new UserDbManager();
  }

  getCartManager() {
    return this._cartManager;
  }

  getProductManager() {
    return this._productManager;
  }

  getUserManager() {
    return this._userManager;
  }

  getTicketManager() {
    return this._ticketManager;
  }
}

export default new FactoryDAO();
