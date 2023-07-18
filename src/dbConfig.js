import mongoose from "mongoose";
import envJSON from "./env.json" assert { type: "json" };

const node_env = process.env.NODE_ENV || "development";
const user = envJSON[node_env].USER;
const password = envJSON[node_env].PASSWORD;

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