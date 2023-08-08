import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt, { genSaltSync } from "bcrypt";
import { tokenKey } from "./dbConfig";
import jwt from "jsonwebtoken";

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
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

//Metodo para generar JWT
export const generateToken = (user) => {
  const token = jwt.sign({ user }, tokenKey, { expiresIn: "2h" });
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

  jwt.verify(token, tokenKey, (err, credentials) => {
    console.log(`error: ${err}`);
    console.log(`credentials: ${credentials}`);

    req.user = credentials.user;
    next();
  });
};

export default __dirname;
export const uploader = multer({ storage });
