import {
  BadRequestError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
} from "../exceptions/exceptions.js";
import ErrorCodes from "../exceptions/errorCodes.js";
import { StatusCodes } from "../utils.js";

function errorHandlerMiddleware(err, req, res, next) {
  let statusCode = StatusCodes.InternalServerError;
  let errorCode = ErrorCodes.GENERIC_ERROR;
  let errorMessage = "Ha ocurrido un error en el servidor.";

  // Detectar y asignar códigos de error específicos
  if (err instanceof AuthenticationError) {
    statusCode = StatusCodes.Unauthorized;
    errorCode = ErrorCodes.AUTHENTICATION_ERROR;
    errorMessage = "Error de autenticación.";
  } else if (err instanceof NotFoundError) {
    statusCode = StatusCodes.NotFound;
    errorCode = ErrorCodes.NOT_FOUND;
    errorMessage = "Recurso no encontrado.";
  } else if (err instanceof BadRequestError) {
    statusCode = StatusCodes.BadRequest;
    errorCode = ErrorCodes.BAD_REQUEST;
    errorMessage = "Parametro incorrecto recibido.";
  } else if (err instanceof AuthorizationError) {
    statusCode = StatusCodes.Forbidden;
    errorCode = ErrorCodes.AUTHORIZATION_ERROR;
    errorMessage = "Error de autorización.";
  }

  // Registrar el error
  console.error(err);

  // Responder con el error
  res
    .status(statusCode)
    .send({ error: errorCode, errorCause: errorMessage, message: err.message });
}

export default errorHandlerMiddleware;
