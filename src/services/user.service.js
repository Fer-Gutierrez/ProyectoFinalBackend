import { HttpError, StatusCodes } from "../utils.js";
import FactoryDAO from "../dao/daoFactory.js";

class UserService {
  constructor() {
    this.userManagerDAO = FactoryDAO.getUserManager();
  }

  async createUser(user) {
    try {
      if (!user)
        throw new HttpError(
          "User must be a object with properties",
          StatusCodes.BadRequest
        );
      if (!user.first_name)
        throw new HttpError(
          "User must have first_name property",
          StatusCodes.BadRequest
        );
      if (!user.last_name)
        throw new HttpError(
          "User must have last_name property",
          StatusCodes.BadRequest
        );
      if (!user.email)
        throw new HttpError(
          "User must have email property",
          StatusCodes.BadRequest
        );
      if (!user.age)
        throw new HttpError(
          "User must have age property",
          StatusCodes.BadRequest
        );
      if (!user.password)
        throw new HttpError(
          "User must have password property",
          StatusCodes.BadRequest
        );

      const result = await this.userManagerDAO.create(user);
      return result;
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  }

  async getUser(email) {
    try {
      if (!email)
        throw new HttpError("email must have value", StatusCodes.BadRequest);
      return await this.userManagerDAO.getByEmail(email);
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  }

  async getUserById(id) {
    try {
      if (!id)
        throw new HttpError("id must have value", StatusCodes.BadRequest);
      return await this.userManagerDAO.getById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new UserService();
