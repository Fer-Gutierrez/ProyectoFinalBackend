import { HttpError, StatusCodes } from "../utils.js";
import FactoryDAO from "../dao/daoFactory.js";
import { BadRequestError, NotFoundError } from "../exceptions/exceptions.js";
import mailService from "./mail.service.js";

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
      let user = await this.userManagerDAO.getById(id);
      if (!user) throw new NotFoundError(`User wwith id ${id} not found.`);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async DoOrUndoPremiumRole(id) {
    try {
      let user = await this.getUserById(id);
      user.role === "premium"
        ? (user.role = "usuario")
        : (user.role = "premium");
      let result = await this.userManagerDAO.update(id, user);
      return {
        message: `The user with id ${id} have '${user.role}' role.`,
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  async SendMailToRestorePassword(email) {
    const userExist = await this.getUser(email);
    if (!userExist)
      throw new NotFoundError(`The user with email: ${email} not found.`);
    mailService.sendSimpleMail({
      from: "",
      to: email,
      subject: "Recupero de contraseña",
      html: `<div>
      <p>Este correo fue enviado para recuperar una contraseña. Favor de dirigirse al siguiente link:</p>
      </div>`,
    });
  }
}

export default new UserService();
