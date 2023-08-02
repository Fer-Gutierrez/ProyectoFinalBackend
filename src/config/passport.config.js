import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";
import { gitHub_clientId, gitHub_clientSectret } from "../dbConfig.js";

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
          let user = await userModel.findOne({ email: username });
          if (user) return done(`El usuario ${username} ya existe`);
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          let result = await userModel.create(newUser);
          if (Object.keys(result).includes("error"))
            return done(`Error: ${Object.values(result)[0]}`);

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
            username.toString().toLowerCase() === "admincoder@coder.com" &&
            password === "adminCod3r123"
          ) {
            const adminUser = {
              name: `Usuario Coder`,
              email: "admincoder@coder.com",
              age: 20,
              role: "admin",
            };
            return done(null, adminUser);
          }

          const user = await userModel.findOne({ email: username });

          if (!user)
            return done(null, false, {
              message: `El usuario ${username} no existe`,
            });
          if (!isValidPassword(user, password))
            return done(null, false, { message: `Credenciales incorrectas` });

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
        clientID: gitHub_clientId,
        clientSecret: gitHub_clientSectret,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({
            email: profile._json.email || profile._json.login,
          });

          if (!user) {
            let newUser = {
              first_name: profile._json.name || "",
              last_name: "",
              email:
                "GitHubUser_" + (profile._json.email || profile._json.login),
              age: "",
              password: "",
            };
            let result = await userModel.create(newUser);
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

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(`Error: ${error}`);
    }
  });
};

export default initializedPassport;
