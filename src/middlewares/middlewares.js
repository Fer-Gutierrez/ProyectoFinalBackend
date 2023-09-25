import { cookieExtractor } from "../utils.js";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config/config.js";
import {
  AuthenticationError,
  AuthorizationError,
} from "../exceptions/exceptions.js";

//Middlewares para Custom Responses:
export const generateCustomResponses = (req, res, next) => {
  res.sendSuccess = (payload, status = 200) =>
    res.status(status).send({ status: "success", payload });

  res.sendError = (error, status = 500) =>
    res.status(status).send({ status: "error", error });
  next();
};

//Middleware para validar Role
export const authRole = (allowedRoles) => {
  return (req, res, next) => {
    const token = cookieExtractor(req);
    if (!token) {
      if (allowedRoles.includes("anyone")) return next();
      throw new AuthenticationError("Token doesnt exists");
    }

    jwt.verify(token, CONFIG.TOKEN_KEY, (err, credentials) => {
      if (err) throw new AuthenticationError("Invalid Token");
      const userRole = credentials.user.role;
      req.user = credentials.user;
      if (!allowedRoles.includes(userRole))
        throw new AuthorizationError("Acceso denegado");
      next();
    });
  };
};

//Middelware para devovler el session.user
export const userSessionExtractor = (req, res, next) => {
  if (CONFIG.LOG_VALIDATION_TYPE === "SESSIONS") {
    return res.sendSuccess({
      status: "success",
      user: req.session.user,
      message: "El usuario se logueo con exito.",
    });
  }
  next();
};

//Middleware para extraer el user del TOKEN de la cookie:
export const userCookieExtractor = (req, res, next) => {
  try {
    let token = cookieExtractor(req);
    if (!token) return next();
    jwt.verify(token, CONFIG.TOKEN_KEY, (err, credentials) => {
      if (err) throw new AuthenticationError("Invalid Token");
      req.user = credentials.user;
      next();
    });
  } catch (error) {
    throw error;
  }
};
