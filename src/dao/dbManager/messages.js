import messageModel from "../models/messages.model.js";

export default class MessageDbManager {
  constructor() {
    console.log("Estamos trabajando con messages (MongoDB");
  }

  addMessage = async (message) => {
    try {
      let result = await messageModel.create(message);
      return result;
    } catch (error) {
      return error;
    }
  };
}
