import { Router } from "express";
import jwt from "jsonwebtoken";
import { tokenKey } from "../dbConfig";

export default class MasterRouter {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter() {
    return this.router;
  }

  init() {}

  applyCallbacks(callbacks) {
    return callbacks.map((cb) => async (...params) => {
      try {
        cb.apply(this, params);
      } catch (error) {
        params[1].status(500).send(error);
      }
    });
  }

  generateCustomResponses = (req, res, next) => {
    res.sendSuccess = (payload, status = 200) =>
      res.status(status).send({ status: "success", payload });

    res.sendError = (error, status = 500) =>
      res.status(status).send({ status: "error", error });

    next();
  };

  validadorRoles = (roles) => {
    return async (req, res, next) => {
      if (roles[0] === "PUBLIC") return next();
      const auth = req.headers.authorization;

      if (!auth) return res.sendError("Not authorized", 401);
      const token = validar.split(" ")[1];
      const user = jwt.verify(token, tokenKey);

      if (!roles.includes(user.role.toUpperCase()))
        return res.sendError("Denegued Access", 403);

      req.user = user;
      next();
    };
  };

  get(path, roles, ...callbacks) {
    this.router.get(
      path,
      this.generateCustomResponses,
      this.validadorRoles(roles),
      this.applyCallbacks(callbacks)
    );
  }

  put(path, roles, ...callbacks) {
    this.router.put(
      path,
      this.generateCustomResponses,
      this.validadorRoles(roles),
      this.applyCallbacks(callbacks)
    );
  }

  post(path, roles, ...callbacks) {
    this.router.post(
      path,
      this.generateCustomResponses,
      this.validadorRoles(roles),
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, roles, ...callbacks) {
    this.router.delete(
      path,
      this.generateCustomResponses,
      this.validadorRoles(roles),
      this.applyCallbacks(callbacks)
    );
  }
}
