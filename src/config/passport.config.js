import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.model.js";
import userService from "../services/user.service.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";
import { CONFIG } from "./config.js";
import { Strategy as JwtStrategy } from "passport-jwt";
import { cookieExtractor } from "../utils.js";

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
        const { first_name, last_name, email, age } = req.body;
        try {
          // let user = await userModel.findOne({ email: username });
          let user = await userService.getUser(email);
          if (user) return done(`El usuario ${username} ya existe`);
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          // let result = await userModel.create(newUser);
          let result = await userService.createUser(newUser);
          // if (Object.keys(result).includes("error"))
          //   return done(`Error: ${Object.values(result)[0]}`);
          return done(null, result);
        } catch (error) {
          return done(`Error: ${error}`);
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
          if (
            username.toString().toLowerCase() === CONFIG.ADMIN_EMAIL &&
            password === CONFIG.ADMIN_PASSWORD
          ) {
            const adminUser = {
              first_name: `Usuario`,
              last_name: "Coder",
              email: CONFIG.ADMIN_EMAIL,
              age: 20,
              role: "admin",
            };
            return done(null, adminUser);
          }

          // const user = await userModel.findOne({ email: username });
          const user = await userService.getUser(username);

          if (!user)
            return done(null, false, {
              message: `User ${username} not found`,
            });
          if (!isValidPassword(user, password))
            return done(null, false, { message: `Incorrect credentials` });

          return done(null, user);
        } catch (error) {
          return done(`Error: ${error}`);
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

          // let user = await userModel.findOne({ email });
          let user = await userService.getUser(email);
          console.log(user);
          if (!user) {
            let newUser = {
              first_name: profile._json.name || "",
              last_name: "",
              email,
              age: "",
              password: "",
            };
            // let result = await userModel.create(newUser);
            let result = await userService.createUser(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          done(`No fue posible loguearse con GitHub: ${error}`);
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
          // const user = await userModel.findOne({ _id: payload.user.id });
          const user = await userService.getUserById(payload.user.id);
          if (!user) return done(null, false, { message: `User not found` });
          done(null, user);
        } catch (error) {
          done(`Error: ${error}`, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // let user = await userModel.findById(id);
      let user = await userService.getUserById(id);
      done(null, user);
    } catch (error) {
      done(`Error: ${error}`);
    }
  });
};

export default initializedPassport;
