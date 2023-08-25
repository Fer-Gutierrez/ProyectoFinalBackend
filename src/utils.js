import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt, { genSaltSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { CONFIG } from "./config/config.js";

//Ruta Absoluta:
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Multer importar archivos:
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/images`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//Metodo para crear el HASH
export const createHash = (password) =>
  bcrypt.hashSync(password, genSaltSync(10));

//Metodo para validar el HASH
export const isValidPassword = (user, password) => {
  return bcrypt.compare(password, user.password);
};

//Metodo para generar JWT
export const generateToken = (user) => {
  const token = jwt.sign({ user }, CONFIG.TOKEN_KEY, { expiresIn: "2h" });
  return token;
};

//Metodo para obtener JWT
export const authToken = (req, res, next) => {
  const headerAuth = req.headers.authorization;
  console.log(headerAuth);
  if (!headerAuth)
    return res
      .status(401)
      .send({ status: "error", error: "No esta autorizado" });

  const token = headerAuth.split(" ")[1];

  jwt.verify(token, CONFIG.TOKEN_KEY, (err, credentials) => {
    console.log(`error: ${err}`);
    console.log(`credentials: ${credentials}`);

    req.user = credentials.user;
    next();
  });
};

//Middelware para devovler el session.user
export const userSessionExtractor = (req, res, next) => {
  if (CONFIG.LOG_VALIDATION_TYPE === "SESSIONS") {
    res.send({
      status: "success",
      user: req.session.user,
      message: "El usuario se logueo con exito.",
    });
  }
  next();
};

//Metodo para extraer el Token JWT de una cookie:
export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.signedCookies) {
    token = req.signedCookies["user"];
  }
  return token;
};

//Metodo para extraer el user del TOKEN de la cookie:
export const userCookieExtractor = (req, res, next) => {
  let token = req.signedCookies["user"];
  if (!token) return next();
  jwt.verify(token, CONFIG.TOKEN_KEY, (err, credentials) => {
    req.user = credentials.user;
    next();
  });
};

//Custom Responses:
export const generateCustomResponses = (req, res, next) => {
  res.sendSuccess = (payload, status = 200) =>
    res.status(status).send({ status: "success", payload });

  res.sendError = (error, status = 500) =>
    res.status(status).send({ status: "error", error });
  next();
};

export class HttpError {
  constructor(message, status = 500, details = null) {
    this.message = message;
    this.status = status;
    this.details = details;
  }
}

export const StatusCodes = {
  Success: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InternalServerError: 500,
};

export default __dirname;
export const uploader = multer({ storage });
