import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import passport from "passport";
import { generateToken } from "../utils.js";
import { secretWord } from "../dbConfig.js";
import cookieParser from "cookie-parser";

const router = Router();

router.post("/register", (req, res, next) => {
  passport.authenticate("register", (error, user, info) => {
    if (error) return res.status(400).send({ status: "error", error });
    if (!user)
      return res.status(400).send({ status: "error", error: info.message });
    return res.send({
      status: "success",
      message: "Usuario registrado correctamente",
      data: user,
    });
  })(req, res, next);
});

router.post("/login", (req, res, next) => {
  passport.authenticate("login", (error, user, info) => {
    if (error) {
      return res.status(500).send({ status: "errror", error });
    }
    if (!user)
      return res.status(401).send({ status: "error", error: info.message });

    req.session.user = {
      id: user._id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
    };
    /*
    res.send({
      status: "success",
      payload: req.session.user,
      message: "El usuario se logueo con exito.",
    });
    */

    // const serialUser = {
    //   id: user._id,
    //   name: `${user.first_name} ${user.last_name}`,
    //   role: user.role,
    //   email: user.email,
    // };

    const token = generateToken(req.session.user);

    res
      .cookie("user", token, { maxAge: 36000000, signed: true })
      .send({ status: "success", payload: req.session.user });
  })(req, res, next);
});

router.post("/loginWithSession", (req, res, next) => {
  passport.authenticate("login", (error, user, info) => {
    if (error) {
      return res.status(500).send({ status: "errror", error });
    }
    if (!user)
      return res.status(401).send({ status: "error", error: info.message });

    req.session.user = {
      id: user._id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
    };

    res.send({
      status: "success",
      payload: req.session.user,
      message: "El usuario se logueo con exito.",
    });
  })(req, res, next);
});

router.post("/loginWithJWT", (req, res, next) => {
  passport.authenticate("login", (error, user, info) => {
    if (error) {
      return res.status(500).send({ status: "errror", error });
    }
    if (!user)
      return res.status(401).send({ status: "error", error: info.message });

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
      .send({ status: "success", payload: serialUser });
  })(req, res, next);
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (!err)
      return res
        .clearCookie("user")
        .send({ status: "success", message: "Se cerró la sesión" });
    else
      return res.status(400).send({
        status: "error",
        error: `No fue posible cerrar la sesión: ${err}`,
      });
  });
});

router.get("/logoutWithSession", async (req, res) => {
  req.session.destroy((err) => {
    if (!err)
      return res.send({ status: "success", message: "Se cerró la sesión" });
    else
      return res.status(400).send({
        status: "error",
        error: `No fue posible cerrar la sesión: ${err}`,
      });
  });
});

router.get("/logoutWithJWT", async (req, res) => {
  if (req.signedCookies["user"])
    return res
      .clearCookie("user")
      .send({ status: "success", message: "Se cerró la session" });
  else return res.send({ status: "error", message: "No existe cookie" });
});

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    res.send({ status: "success", user: req.user });
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.counter = 1;
    res.redirect("/");
  }
);

export default router;
