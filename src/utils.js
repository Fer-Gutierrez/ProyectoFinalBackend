import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt, {genSaltSync} from "bcrypt";

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

export default __dirname;
export const uploader = multer({ storage });
