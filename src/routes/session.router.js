import { Router } from "express";
import userModel from "../dao/models/user.model.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;
  const exist = await userModel.findOne({ email });
  if (exist)
    return res
      .status(400)
      .send({ status: "error", error: "El email ya se ecuentra registrado." });

  let rol = "usuario";
  if (email.toString().toLowerCase() === "admincoder@coder.com") {
    // rol = "admin"
    return res.status(400).send({
      status: "error",
      error: "No se puede utilizar ese email para registrarse",
    });
  }

  const user = {
    first_name,
    last_name,
    email,
    age,
    password,
    role: rol,
  };

  let result = await userModel.create(user);
  if (Object.keys(result).includes("error"))
    res.status(404).send({ status: "error", error: Object.values(result)[0] });
  else {
    res.send({
      status: "success",
      message: "User was registered",
      data: result,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email, password });

  if (
    email.toString().toLowerCase() === "admincoder@coder.com" &&
    password === "adminCod3r123"
  ) {
    req.session.user = {
      name: `Usuario Coder`,
      email: "admincoder@coder.com",
      age: 20,
      role: "admin",
    };
  } else {
    if (!user)
      return res
        .status(400)
        .send({ status: "error", error: "Email y contraseña incorrectos." });

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
    };
  }

  res.send({
    status: "success",
    payload: req.session.user,
    message: "El usuario se logueo con exito.",
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (!err) res.send({ status: "success", message: "Se cerró la sesión" });
    else
      res.status(400).send({
        status: "error",
        error: `No fue posible cerrar la sesión: ${err}`,
      });
  });
});

export default router;
