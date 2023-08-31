import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils.js";
import { userSessionExtractor, generateCustomResponses } from "../utils.js";
import { CONFIG } from "../config/config.js";

class SessionRouter {
  constructor() {
    this.inicioSession = Router();
    this.inicioSession.post(
      "/register",
      generateCustomResponses,
      this.register
    );
    this.inicioSession.post("/login", generateCustomResponses, this.login);
    this.inicioSession.get("/logout", generateCustomResponses, this.logout);
    this.inicioSession.get(
      "/current",
      generateCustomResponses,
      userSessionExtractor,
      passport.authenticate("current", { session: false }),
      this.current
    );
    this.inicioSession.get(
      "/github",
      generateCustomResponses,
      passport.authenticate("github", { scope: ["user:email"] }),
      async (req, res) => {}
    );
    this.inicioSession.get(
      "/githubcallback",
      generateCustomResponses,
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
      if (error) return res.sendError({ message: error.message }, 500);
      console.log("Estamos");
      if (!user) return res.sendError({ message: info.message }, 400);
      return res.sendSuccess({
        message: "Usuario registrado correctamente",
        data: user,
      });
    })(req, res, next);
  }

  login(req, res, next) {
    passport.authenticate("login", (error, user, info) => {
      if (error) return res.sendError({ message: error.message }, 500);
      if (!user) return res.sendError({ message: info.message }, 400);

      if (CONFIG.LOG_VALIDATION_TYPE === "JWT") {
        const serialUser = {
          id: user._id,
          name: `${user.first_name} ${user.last_name}`,
          age: user.age,
          role: user.role,
          email: user.email,
        };
        const token = generateToken(serialUser);
        res
          .cookie("user", token, { maxAge: 36000000, signed: true })
          .sendSuccess(serialUser);
      } else if (CONFIG.LOG_VALIDATION_TYPE === "SESSIONS") {
        req.session.user = {
          id: user._id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          age: user.age,
          role: user.role,
        };
        res.sendSuccess({
          message: "El usuario se logueo con exito.",
          data: req.session.user,
        });
      }
    })(req, res, next);
  }

  async logout(req, res) {
    if (req.session.user?.email.toString().includes("GitHubUser-")) {
      req.session.destroy((err) => {
        if (!err) return res.sendSuccess({ message: "Se cerró la session" });
        else
          return res.sendError({
            message: `No fue posible cerrar la sesión: ${err}`,
          });
      });
    } else if (CONFIG.LOG_VALIDATION_TYPE === "JWT") {
      if (req.signedCookies["user"])
        return res
          .clearCookie("user")
          .sendSuccess({ message: "Se cerró la session" });
      else return res.sendError({ message: "No existe cookie" });
    } else if (CONFIG.LOG_VALIDATION_TYPE === "SESSIONS") {
      req.session.destroy((err) => {
        if (!err) return res.sendSuccess({ message: "Se cerró la session" });
        else
          return res.sendError({
            message: `No fue posible cerrar la sesión: ${err}`,
          });
      });
    }
  }

  current(req, res) {
    res.sendSuccess(req.user);
  }
}

export default new SessionRouter();
