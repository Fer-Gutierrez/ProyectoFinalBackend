import { Router } from "express";
import { generateProducts } from "./products.mock.js";

class MockRouter {
  constructor() {
    this.inicioMock = Router();
    this.inicioMock.get("/", (req, res) => {
      const total = +req.query.total || 50;
      const products = Array.from({ length: total }, () => generateProducts());
      res.sendSuccess(products);
    });
  }

  getRouter() {
    return this.inicioMock;
  }
}

export default new MockRouter();
