import mongoose from "mongoose";
import envJSON from "./env.json" assert { type: "json" };

const node_env = process.env.NODE_ENV || "development";
export const user = envJSON[node_env].USER;
export const password = envJSON[node_env].PASSWORD;
export const secretWord = envJSON[node_env].SECRETWORD;
export const gitHub_clientId = envJSON[node_env].GITHUB_CLIENTID;
export const gitHub_clientSectret = envJSON[node_env].GITHUB_CLIENTSECRET;
export const tokenKey = envJSON[node_env].TOKEN_KEY;
export const logValidationType = envJSON[node_env].LOG_VALIDATION_TYPE;
export const adminEmail = envJSON[node_env].ADMIN_EMAIL;
export const adminPassword = envJSON[node_env].ADMIN_PASSWORD;

export default class Database {
  constructor() {
    this._connect();
  }

  _connect = async () => {
    try {
      await mongoose.connect(
        `mongodb+srv://${user}:${password}@ecommerce-pfbackend.c4du6ot.mongodb.net/?retryWrites=true&w=majority`,
        { dbName: "e-commerce" }
      );
      console.log("Conected to MongoAtlas");
    } catch (error) {
      console.log("error: ", error);
    }
  };
}
