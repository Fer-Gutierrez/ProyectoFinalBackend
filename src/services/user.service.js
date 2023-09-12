import { HttpError, StatusCodes } from "../utils.js";
import FactoryDAO from "../dao/daoFactory.js";
import { BadRequestError } from "../exceptions/exceptions.js";

class UserService {
  constructor() {
    this.userManagerDAO = FactoryDAO.getUserManager();
  }

  async createUser(user) {
    try {
      if (!user)
        throw new BadRequestError("User must be a object with properties");
      if (!user.first_name)
        throw new BadRequestError("User must have first_name property");
      if (!user.last_name)
        throw new BadRequestError("User must have last_name property");
      if (!user.email)
        throw new BadRequestError("User must have email property");
      if (!user.age) throw new BadRequestError("User must have age property");
      if (!user.password)
        throw new BadRequestError("User must have password property");

      const result = await this.userManagerDAO.create(user);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getUser(email) {
    try {
      if (!email) throw new BadRequestError("email must have value");
      return await this.userManagerDAO.getByEmail(email);
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      if (!id) throw new BadRequestError("id must have value");
      return await this.userManagerDAO.getById(id);
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
