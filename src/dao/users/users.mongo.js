import userModel from "../models/user.model.js";

export default class UserDbManager {
  constructor() {}

  create = async (user) => {
    try {
      const result = await userModel.create(user);
      if (Object.keys(result).includes("error"))
        throw new Error(`Error: ${Object.values(result)[0]}`);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getAll = async () => {
    try {
      return await userModel.find().lean();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getByEmail = async (email) => {
    try {
      const result = await userModel.findOne({ email });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getById = async (id) => {
    try {
      return await userModel.findOne({ _id: id });
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
