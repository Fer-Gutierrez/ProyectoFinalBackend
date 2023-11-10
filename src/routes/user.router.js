import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { uploader } from "../utils.js";
import { authRole } from "../middlewares/middlewares.js";

class UserRouter {
  constructor() {
    this.inicioUser = Router();
    this.inicioUser.get("/", userController.GetUsers);
    this.inicioUser.delete(
      "/",
      authRole(["admin"]),
      userController.RemoveUsersWithTwoDaysInactivity
    );
    this.inicioUser.put("/premium/:uid", userController.DoOrUndoPremiumRole);
    this.inicioUser.post(
      "/:uid/documents",
      uploader.array("files", 10),
      userController.AddDocumentsToUser
    );
    this.inicioUser.post(
      "/sendRestoreMail",
      userController.SendMailToRestorePassword
    );
    this.inicioUser.post("/restorePassword", userController.restorePassword);
  }

  getRouter() {
    return this.inicioUser;
  }
}

export default new UserRouter();
