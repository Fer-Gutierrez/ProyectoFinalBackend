import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.model.js";
import userService from "../services/user.service.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";
import { CONFIG } from "./config.js";
import { Strategy as JwtStrategy } from "passport-jwt";
import { cookieExtractor } from "../utils.js";
import { UserDTO } from "../dao/Dtos/user.dto.js";
import { BadRequestError, NotFoundError } from "../exceptions/exceptions.js";

const LocalStrategy = local.Strategy;
const initializedPassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = req.body;
          let user = await userService.getUser(email);
          if (user)
            throw new BadRequestError(`El usuario ${username} ya existe`);

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          let result = await userService.createUser(newUser);
          req.logger.debug(
            `Passport-Register: Registro exitoso de usuario ${newUser.email}`
          );
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          req.logger.debug(`PassportLogin: Intento de loging de ${username}`);
          if (
            username.toString().toLowerCase() === CONFIG.ADMIN_EMAIL &&
            password === CONFIG.ADMIN_PASSWORD
          ) {
            const adminUser = new UserDTO({
              first_name: `Usuario`,
              last_name: "Coder",
              email: CONFIG.ADMIN_EMAIL,
              role: "admin",
            });
            return done(null, adminUser);
          }

          const user = await userModel.findOne({ email: username });
          if (!user) throw new NotFoundError(`User ${username} not found`);
          req.logger.debug(
            `PassportLogin: El usuario ${username} existe en la base de datos.`
          );
          if (!(await isValidPassword(user, password)))
            throw new BadRequestError(
              `La contraseña de ${username} es incorrecta`
            );

          const userDto = new UserDTO(user);
          req.logger.debug(
            `PassportLogin: El usuario ${username} se registró con éxito.`
          );
          return done(null, userDto);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: CONFIG.GITHUB_CLIENTID,
        clientSecret: CONFIG.GITHUB_CLIENTSECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let email = "";
          if (profile._json.email) {
            email = profile._json.email;
          } else {
            email = `GitHubUser-${profile._json.login}`;
          }

          let user = await userModel.findOne({ email });

          if (!user) {
            let newUser = {
              first_name: profile._json.name || "",
              last_name: "",
              email,
              password: "",
            };
            let result = await userModel.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: CONFIG.TOKEN_KEY,
      },
      async (payload, done) => {
        try {
          const user = await userService.getUser(payload.user.email);
          if (!user) throw new NotFoundError(`User not found`);
          req.logger.debug(
            `Passport-Current: Validacion de credenciales de ${payload.user.email}`
          );
          const userDto = new UserDTO(user);
          done(null, userDto);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userService.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializedPassport;
