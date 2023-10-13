import mongoose from "mongoose";
import productModel from "../../src/dao/models/products.model.js";
import userModel from "../../src/dao/models/user.model.js";
import cartModel from "../../src/dao/models/carts.model.js";
import ticketModel from "../../src/dao/models/ticket.model.js";

before(async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://fgutierrez:35750989@ecommerce-pfbackend.c4du6ot.mongodb.net/",
      {
        dbName: "TestECommerce",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
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
