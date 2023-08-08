import MasterRouter from "../master.router.js";
import jwt from "jsonwebtoken";
import userModel from "../dao/models/user.model.js";
import passport from "passport";

export default class UserRouter extends MasterRouter {
  init() {
    this.post("/register", ["PUBLIC"], (req, res) => {
      passport.authenticate("register", (error, user, info) => {
        if (error) return res.sendError(error, 400);
        if (!user) return res.sendError(info.message, 401);
        return res.sendSuccess({
          message: "Usuario registrado correctamente",
          data: user,
        });
      })(req, res);
    });

    this.post("/login", ["PUBLIC"], (req, res) => {
      passport.authenticate("login", (error, user, info) => {
        if (error) return res.sendError(error);
        if (!user) return res.sendError(info.message, 401);
        req.session.user = {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          age: user.age,
          role: user.role,
        };
        res.sendSuccess({
          data: req.session.user,
          message: "El usuario se logueo con exito.",
        });
      })(req, res);
    });

    this.get("/logout", ["USER", "ADMIN"], async (req, res) => {
      req.session.destroy((err) => {
        if (!err) return res.sendSuccess({ message: "Se cerró la sesión" });
        else
          return res.sendError(`No fue posible cerrar la sesión: ${err}`, 400);
      });
    });
  }
}
