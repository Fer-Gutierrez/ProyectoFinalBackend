import fs from "fs";
import dotenv from "dotenv";

const rawdata = fs.readFileSync("config.json");
const settings = JSON.parse(rawdata);
console.log(`Ambiente: ${settings.NODE_ENV}`);

dotenv.config({
  path:
    settings.NODE_ENV === "production"
      ? "./.env.production"
      : "./.env.development",
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
};
