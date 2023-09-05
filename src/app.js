import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import ConexionDB from "./config/dbConfig.js";
import ProductDbManager from "./dao/products/products.mongo.js";
import MessageDbManager from "./dao/messages/messages.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { CONFIG } from "./config/config.js";
import initializedPassport from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import sessionRouter from "./routes/session.router.js";
import { generateCustomResponses } from "./middlewares/middlewares.js";

//CONEXION BD
if (CONFIG.PERSISTENCE_TYPE === "mongo") new ConexionDB();

//CONFIGURACION DE EXPRESS
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`)); //ruta estatica
app.use(cookieParser(CONFIG.SECRETWORD));

//CONFIGURACION DE HANDLEBARS - VISTAS
app.engine("handlebars", handlebars.engine()); //Creo el motor de vistas
app.set("views", `${__dirname}/views`); //Defino la ruta donde estaran las vistas
app.set("view engine", "handlebars"); //Defino el motor crear para correr las vistas

//SESSION:
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${CONFIG.USER}:${CONFIG.PASSWORD}@ecommerce-pfbackend.c4du6ot.mongodb.net/?retryWrites=true&w=majority`,
      dbName: CONFIG.DBNAME,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 3000,
    }),
    secret: CONFIG.SECRETWORD,
    resave: false,
    saveUninitialized: false,
  })
);

//INIT PASSPORT
initializedPassport();
app.use(passport.initialize());
app.use(passport.session({ secret: CONFIG.SECRETWORD }));


//ROUTES VIEWS
app.use("/", viewsRouter);

//ROUTES API
app.use("/api/products", productRouter.getRouter());
app.use("/api/carts", cartRouter.getRouter());
app.use("/api/sessions", sessionRouter.getRouter());

//CONFIGURACION DE HTTP SERVER
export const httpServer = app.listen(8080, () =>
  console.log("Servidor Arriba")
);

//CONFIGURACION DE SOCKET.IO
export const socketServer = new Server(httpServer); //Creamos el socketServer utilizando httpServer
//----- abrimos conexcion con cada cliente -Handshake-:
socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado");

  //ENVIO LOS PRODUCTOS POR PRIMERA VEZ:
  // const pm = new ProductFileManager(`${__dirname}/data/products.json`);
  const pm = new ProductDbManager();
  let products = await pm.getProducts();
  socket.emit("refreshListProducts", JSON.stringify(products, null, "\t"));

  //ESCUCHO LOS MENSAJES:
  socket.on("chatMessage", async (data) => {
    data = JSON.parse(data);
    let messageRecived = { user: data.user, message: data.message };
    const mm = new MessageDbManager();
    let messageSaved = await mm.addMessage(messageRecived);

    if (!Object.keys(messageSaved).includes("errors")) {
      socketServer.emit(
        "chatMessage",
        JSON.stringify(messageRecived, null, "\t")
      );
    }
  });
});
