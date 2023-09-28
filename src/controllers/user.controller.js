import { Logger } from "winston";
import userService from "../services/user.service.js";
import { BadRequestError } from "../exceptions/exceptions.js";
import { th } from "@faker-js/faker";

class UserController {
  async DoOrUndoPremiumRole(req, res, next) {
    try {
      let id = req.params.uid;
      req.logger.debug(`tring to change the role o user with id ${uid}.`);
      let result = await userService.DoOrUndoPremiumRole(id);
      req.logger.info(`El  usuario con id ${id}  tiene role = premium.`);
      res.sendSuccess(result);
    } catch (error) {
      next(error);
    }
  }

  async SendMailToRestorePassword(req, res, next) {
    try {
      const { email } = req.body;
      req.logger.debug(`${email} requested restore the password`);
      let result = await userService.SendMailToRestorePassword(email);
      req.logger.info(
        `the mail  with the link to restore the password was sent to ${email}`
      );
      res.sendSuccess(result);
    } catch (error) {
      next(error);
    }
  }

  async restorePassword(req, res, next) {
    try {
      const { newPassword, confirmPassword, userId } = req.body;
      req.logger.debug(
        `Iniciamos la restauración de la contraseña del usuario con id ${userId}`
      );
      if (!userId)
        throw new BadRequestError("The body didn't send the userid.");
      if (!newPassword || !confirmPassword)
        throw new BadRequestError("The password must have value");
      if (newPassword !== confirmPassword)
        throw new BadRequestError("The passwords are not equals");
      let result = await userService.restorePassword(userId, newPassword);
      req.logger.info("Contraseña actualizada con exito.");
      res.sendSuccess(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
