import fs from "fs";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rawdata = fs.readFileSync(path.resolve(__dirname, "..", "config.json"));
const settings = JSON.parse(rawdata);
console.log(`Ambiente: ${settings.NODE_ENV}`);

dotenv.config({
  path:
    settings.NODE_ENV === "production"
      ? path.resolve(__dirname, "..", ".env.production")
      : settings.NODE_ENV === "development"
      ? path.resolve(__dirname, "..", ".env.development")
      : path.resolve(__dirname, "..", ".env.test"),
});

export const CONFIG = {
  SERVER: process.env.SERVER,
  PORT: process.env.PORT,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  DBNAME: process.env.DBNAME,
  SECRETWORD: process.env.SECRETWORD,
  GITHUB_CLIENTID: process.env.GITHUB_CLIENTID,
  GITHUB_CLIENTSECRET: process.env.GITHUB_CLIENTSECRET,
  TOKEN_KEY: process.env.TOKEN_KEY,
  LOG_VALIDATION_TYPE: process.env.LOG_VALIDATION_TYPE,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  PERSISTENCE_TYPE: process.env.PERSISTENCE_TYPE,
  NODE_ENV: process.env.NODE_ENV,
  MAIL_SERVICE: process.env.MAIL_SERVICE,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
};
