import mongoose from "mongoose";
import productModel from "../../src/dao/models/products.model.js";
import userModel from "../../src/dao/models/user.model.js";
import cartModel from "../../src/dao/models/carts.model.js";
import ticketModel from "../../src/dao/models/ticket.model.js";
import { CONFIG } from "../../src/config/config.js";

before(async () => {
  try {
    if (CONFIG.NODE_ENV === "test") {
      const connection = await mongoose.connect(
        `mongodb+srv://${CONFIG.USER}:${CONFIG.PASSWORD}@ecommerce-pfbackend.c4du6ot.mongodb.net/`,
        {
          dbName: `${CONFIG.DBNAME}`,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
    } else {
      throw new Error(
        `No se puede ejecutar el test, el ambiente en config.json es '${CONFIG.NODE_ENV}'. Debe cambiarlo a 'test'`
      );
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error; // Re-throw the error to fail the test setup
  }
});

after(async () => {
  await mongoose.connection.close();
});

export const dropProducts = async () => {
  await productModel.collection.drop();
};
export const dropUsers = async () => {
  await userModel.collection.drop();
};
export const dropCarts = async () => {
  await cartModel.collection.drop();
};
export const dropTickets = async () => {
  await ticketModel.collection.drop();
};
