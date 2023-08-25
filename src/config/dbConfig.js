import mongoose from "mongoose";
import { CONFIG } from "./config.js";

class ConexionDB {
  static #instance;

  constructor(){
    if(!ConexionDB.#instance){
      ConexionDB.#instance  =this;
      this.connect();
    }
    return ConexionDB.#instance;
  }

  async connect() {
    try {
      await mongoose.connect(
        `mongodb+srv://${CONFIG.USER}:${CONFIG.PASSWORD}@ecommerce-pfbackend.c4du6ot.mongodb.net/?retryWrites=true&w=majority`,
        { dbName: CONFIG.DBNAME }
      );
      console.log("Conected to MongoAtlas");
    } catch (error) {
      console.log("error: ", error);
    }
  }
}
export default ConexionDB;
