import userService from "../services/user.service.js";
import { BadRequestError } from "../exceptions/exceptions.js";

class UserController {
  async AddDocumentsToUser(req, res, next) {
    try {
      const fileName = req.body.fileName;
      const filesPath = req.files ? req.files.map((f) => f.path) : [];
      const userId = req.params.uid;
      req.logger.debug(`tring to add documents from user with id ${userId}.`);

      let result = await userService.addDocumentsToUser(
        userId,
        fileName,
        filesPath
      );
      req.logger.info(
        `The files of type:${fileName} was added from de user id: ${userId}.`
      );
      res.sendSuccess(result);
    } catch (error) {
      next(error);
    }
  }

  async DoOrUndoPremiumRole(req, res, next) {
    try {
      let id = req.params.uid;
      req.logger.debug(`tring to change the role o user with id ${id}.`);
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
