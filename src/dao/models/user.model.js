import mongoose from "mongoose";

const userCollecttion = "users";
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  role: {
    type: String,
    enum: ["usuario", "admin", "premium"],
    default: "usuario",
  },
  cart: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
    },
  },
  documents: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        reference: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  },
  last_connection: {
    type: Date,
    default: new Date(),
  },
});

const userModel = mongoose.model(userCollecttion, userSchema);
export default userModel;
