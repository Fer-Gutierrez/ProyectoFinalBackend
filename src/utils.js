import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";

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

export default __dirname;
export const uploader = multer({ storage });
