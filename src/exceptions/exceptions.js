import { StatusCodes } from "../utils.js";

export class AuthenticationError extends Error {
  constructor(message = "Error de autenticación") {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = StatusCodes.Unauthorized;
    Error.captureStackTrace(this, AuthenticationError);
  }
}

export class AuthorizationError extends Error {
  constructor(message = "Error de autorización") {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = StatusCodes.Forbidden;
    Error.captureStackTrace(this, AuthorizationError);
  }
}

export class NotFoundError extends Error {
  constructor(message = "Recurso no encontrado") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = StatusCodes.NotFound;
    Error.captureStackTrace(this, NotFoundError);
  }
}

export class BadRequestError extends Error {
  constructor(message = "Parametro incorrecto recibido") {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = StatusCodes.BadRequest;
    Error.captureStackTrace(this, BadRequestError);
  }
}
