import dotenv from "dotenv";

const enviroment = "DEVELOPMENT";
dotenv.config({
  path:
    enviroment === "DEVELOPMENT" ? "./.env.development" : "./.env.production",
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
  PERSISTENCE_TYPE:  process.env.PERSISTENCE_TYPE
};
