import { createHash, isValidPassword } from "../utils.js";
import FactoryDAO from "../dao/daoFactory.js";
import { BadRequestError, NotFoundError } from "../exceptions/exceptions.js";
import mailService from "./mail.service.js";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config/config.js";
import { UserDTO } from "../dao/Dtos/user.dto.js";

const calcularHorasTranscurridas = (fechaInicio, fechaFin) => {
  const diffEnMilisegundos = fechaFin - fechaInicio;
  const horas = diffEnMilisegundos / 1000 / 60 / 60;
  return parseFloat(horas.toFixed(2));
};

class UserService {
  constructor() {
    this.userManagerDAO = FactoryDAO.getUserManager();
  }

  async RemoveUsersWithTwoDaysInactivity() {
    try {
      const limitHours = 48;
      let users = await this.userManagerDAO.getAll();
      let usersToRemove = [];

      if (users.length <= 0)
        throw new NotFoundError(`No existen usuarios por eliminar.`);

      users.forEach((u) => {
        const horasTranscurridas = calcularHorasTranscurridas(
          u.last_connection,
          new Date()
        );

        console.log("horas transcurridas:", horasTranscurridas);

        if (horasTranscurridas > limitHours) usersToRemove.push(u);
      });

      if (usersToRemove.length <= 0)
        throw new NotFoundError(`No existen usuarios por eliminar.`);
      let infoUsersRemoved = [];
      for (const user of usersToRemove) {
        let result = await this.userManagerDAO.delete(user._id);
        let mailSended = await mailService.sendSimpleMail({
          from: "",
          to: user.email,
          subject: "Eliminacion de cuenta por inactividad",
          html: `
          <div>
            <p>Hola ${user.first_name}:</p>
            <p>Le informamos que su cuenta a sido eliminada por inactividad. Registramos que no ingresó a la aplicación en las ultimas ${limitHours} horas.</p>
            <p>Puede volver a registrarse en el siguiente link:</p>
            <a href="${CONFIG.SERVER}/register">REGISTRARSE</a>
          </div>`,
        });
        infoUsersRemoved.push({
          ...result,
          email: user.email,
          mailSent: mailSended.accepted.length > 0 ? true : false,
        });
      }

      let mensaje = `Se eliminaron ${infoUsersRemoved.length} usuarios que no tenian actividad hace ${limitHours} horas.`;
      return { mensaje, infoUsersRemoved };
    } catch (error) {
      throw error;
    }
  }

  async getUsers() {
    try {
      let users = await this.userManagerDAO.getAll();
      let usersDto = [];
      if (users.length <= 0)
        throw new NotFoundError("No se encontraron usuarios.");

      users.forEach((u) => {
        let userDto = new UserDTO(u);
        usersDto.push({ ...userDto });
      });

      return usersDto;
    } catch (error) {
      throw error;
    }
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

      //VALIDAMOS SI TIENE LOS DOCUMENTOS NECESARIOS:
      if (user.role === "usuario") {
        let missingReqs = [
          "identificacion",
          "comprobante de domicilio",
          "comprobante de estado de cuenta",
        ];
        user.documents.forEach((doc) => {
          missingReqs.forEach((rq) => {
            if (doc.name.toLowerCase() === rq)
              missingReqs = missingReqs.filter(
                (r) => r !== doc.name.toLowerCase()
              );
          });
        });

        if (missingReqs.length > 0)
          throw new BadRequestError(
            `The user needs the following documents to be premium: ${missingReqs.join(
              ", "
            )}`
          );
      }

      //CAMBIAMOS EL ROL DEL USUARIO:
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
    try {
      const userExist = await this.getUser(email);
      if (!userExist)
        throw new NotFoundError(`The user with email: ${email} not found.`);

      const secretKey = CONFIG.TOKEN_KEY;
      const expirationTime = "1h";
      const token = jwt.sign({ userId: userExist._id }, secretKey, {
        expiresIn: expirationTime,
      });

      let result = await mailService.sendSimpleMail({
        from: "",
        to: email,
        subject: "Recupero de contraseña",
        html: `
        <div>
          <p>Este correo fue enviado para recuperar una contraseña. Favor de dirigirse al siguiente link:</p>
          <a href="${CONFIG.SERVER}/resetPassword?token=${token}">LINK</a>
        </div>`,
      });
      return {
        message: `The mail was sent.`,
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  async restorePassword(userId, newPassword) {
    try {
      const user = await this.getUserById(userId);
      if (await isValidPassword(user, newPassword))
        throw new BadRequestError(
          "the password cannot be the same as the previous one"
        );
      user.password = createHash(newPassword);
      let result = await this.userManagerDAO.update(userId, user);
      return { message: "Password was updated.", result };
    } catch (error) {
      throw error;
    }
  }

  async updateLastConnection(id) {
    try {
      if (!id) throw new BadRequestError("id must have value");
      let userToUpdate = await this.userManagerDAO.getById(id);
      if (!userToUpdate)
        throw new NotFoundError(`User wwith id ${id} not found.`);
      userToUpdate.last_connection = new Date();
      let result = await this.userManagerDAO.update(id, userToUpdate);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async addDocumentsToUser(id, fileName, filesPath) {
    try {
      if (!id) throw new BadRequestError("id must have value");
      let user = await this.userManagerDAO.getById(id);
      if (!user) throw new NotFoundError(`User wwith id ${id} not found.`);
      filesPath.forEach((filePath) => {
        if (!filePath)
          throw new BadRequestError("The filePath must have a value");
      });

      filesPath.forEach((filePath) => {
        user.documents.push({ name: fileName, reference: filePath });
      });

      let result = await this.userManagerDAO.update(id, user);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
