import mongoose from "mongoose";

const messageCollection = "messages";
const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    default: new Date(),
  },
});

const messageModel = mongoose.model(messageCollection, messageSchema);
export default messageModel;
