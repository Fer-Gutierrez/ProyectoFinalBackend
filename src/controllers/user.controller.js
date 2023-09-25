import userService from "../services/user.service.js";

class UserController {
  async DoOrUndoPremiumRole(req, res, next) {
    try {
      let id = req.params.uid;
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
      let result = await userService.SendMailToRestorePassword(email);
      res.sendSuccess(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
