import { Router } from "express";
import userController from "../controllers/user.controller.js";

class UserRouter {
  constructor() {
    this.inicioUser = Router();
    this.inicioUser.put("/premium/:uid", userController.DoOrUndoPremiumRole);
    this.inicioUser.get("/sendRestoreMail", userController.SendMailToRestorePassword)
  }

  getRouter() {
    return this.inicioUser;
  }
}

export default new UserRouter();
