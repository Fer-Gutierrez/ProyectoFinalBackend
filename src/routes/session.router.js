import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils.js";
import { CONFIG } from "../config/config.js";
import {
  userSessionExtractor,
  userCookieExtractor,
} from "../middlewares/middlewares.js";
import {
  AuthenticationError,
  BadRequestError,
  NotFoundError,
} from "../exceptions/exceptions.js";

class SessionRouter {
  constructor() {
    this.inicioSession = Router();
    this.inicioSession.post("/register", this.register);
    this.inicioSession.post("/login", this.login);
    this.inicioSession.get("/logout", this.logout);
    this.inicioSession.get(
      "/current",
      userSessionExtractor,
      passport.authenticate("current", { session: false }),
      this.current
    );
    this.inicioSession.get(
      "/github",
      passport.authenticate("github", { scope: ["user:email"] }),
      async (req, res) => {}
    );
    this.inicioSession.get(
      "/githubcallback",
      passport.authenticate("github", { failureRedirect: "/login" }),
      async (req, res) => {
        req.session.user = req.user;
        req.session.counter = 1;
        res.redirect("/");
      }
    );
  }

  getRouter() {
    return this.inicioSession;
  }

  register(req, res, next) {
    passport.authenticate("register", (error, user, info) => {
      try {
        if (error) throw error;

        if (!user) throw new BadRequestError(info.message);
        return res.sendSuccess({
          message: "Usuario registrado correctamente",
          data: user,
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  }

  login(req, res, next) {
    passport.authenticate("login", (error, user, info) => {
      try {
        if (error) throw error; //return res.sendError({ message: error.message },StatusCodes.InternalServerError);
        if (!user) throw new NotFoundError(info.message); //return res.sendError({ message: info.message }, StatusCodes.BadRequest);

        if (CONFIG.LOG_VALIDATION_TYPE === "JWT") {
          req.logger.debug(
            `Session.router-Loggin: Generacion de Token con: JWT`
          );
          const token = generateToken(user);
          res
            .cookie("user", token, { maxAge: 36000000, signed: true })
            .sendSuccess(user);
        } else if (CONFIG.LOG_VALIDATION_TYPE === "SESSIONS") {
          req.logger.debug(`Session.router-Loggin: Usuario guadado en SESSION`);
          req.session.user = user;
          res.sendSuccess(req.session.user);
        }
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  }

  async logout(req, res, next) {
    try {
      if (req.session.user?.email.toString().includes("GitHubUser-")) {
        req.logger.debug(`Session.router-Logout: Logout de GitHubUser`);
        req.session.destroy((err) => {
          if (!err) return res.sendSuccess({ message: "Se cerró la session" });
          else throw new Error(`No fue posible cerrar la sesión: ${err}`);
        });
      } else if (CONFIG.LOG_VALIDATION_TYPE === "JWT") {
        req.logger.debug(`Session.router-Logout: Logout de JWT`);
        if (req.signedCookies["user"]) {
          console.log(req.user);
          return res
            .clearCookie("user")
            .sendSuccess({ message: "Se cerró la session" });
        } else throw new AuthenticationError("No existe cookie");
      } else if (CONFIG.LOG_VALIDATION_TYPE === "SESSIONS") {
        req.logger.debug(`Session.router-Logout: Logout de SESSIONS`);
        req.session.destroy((err) => {
          if (!err) return res.sendSuccess({ message: "Se cerró la session" });
          else throw new Error(`No fue posible cerrar la sesión: ${err}`);
        });
      }
    } catch (error) {
      next(error);
    }
  }

  current(req, res) {
    res.sendSuccess(req.user);
  }
}

export default new SessionRouter();
