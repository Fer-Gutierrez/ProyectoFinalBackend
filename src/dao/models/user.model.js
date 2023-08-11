import mongoose from "mongoose";

const userCollecttion = "users";
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  role: { type: String, default: "usuario" },
  cart: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
    },
  },
});

const userModel = mongoose.model(userCollecttion, userSchema);
export default userModel;
