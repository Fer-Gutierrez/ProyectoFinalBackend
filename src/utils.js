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

//Middleware para obtener JWT
export const authToken = (req, res, next) => {
  const headerAuth = req.headers.authorization;
  if (!headerAuth)
    return res.sendError("Token doesnt exist", StatusCodes.Unauthorized);

  const token = headerAuth.split(" ")[1];

  jwt.verify(token, CONFIG.TOKEN_KEY, (err, credentials) => {
    if (err) return res.sendError("Invalid Token", StatusCodes.Unauthorized);

    req.user = credentials.user;
    next();
  });
};

//Metodo para extraer el Token JWT de una cookie:
export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.signedCookies) {
    token = req.signedCookies["user"];
  }
  return token;
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
