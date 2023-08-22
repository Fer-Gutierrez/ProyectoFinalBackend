import { createHash } from "../utils.js";
import userModel from "../dao/models/user.model.js";

class UserService {
  constructor() {}

  async createUser(user) {
    try {
      user.password = createHash(user.password);
      const result = await userModel.create(user);
      if (Object.keys(result).includes("error"))
        throw new Error(`Error: ${Object.values(result)[0]}`);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUser(email) {
    try {
      const user = await userModel.findOne({ email });
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserById(id){
    try {
      const user = await userModel.findOne({ _id: id });
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new UserService();
