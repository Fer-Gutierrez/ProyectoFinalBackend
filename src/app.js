import express from "express";
import productsFileRouter from "./routes/productsFile.router.js";
import cartsFileRouter from "./routes/cartsFile.router.js";
import productsDbRouter from "./routes/productsDb.router.js";
import cartsDbRouter from "./routes/cartDb.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import Database from "./dbConfig.js";
import ProductDbManager from "./dao/dbManager/products.js";
import MessageDbManager from "./dao/dbManager/messages.js";

//CONEXION BD
const db = new Database();

//CONFIGURACION DE EXPRESS
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`)); //ruta estatica

//CONFIGURACION DE HANDLEBARS - VISTAS
app.engine("handlebars", handlebars.engine()); //Creo el motor de vistas
app.set("views", `${__dirname}/views`); //Defino la ruta donde estaran las vistas
app.set("view engine", "handlebars"); //Defino el motor crear para correr las vistas

//ROUTES VIEWS
app.use("/", viewsRouter);

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
    console.log(messageSaved);
    if (!Object.keys(messageSaved).includes("errors")) {
      socketServer.emit(
        "chatMessage",
        JSON.stringify(messageRecived, null, "\t")
      );
    }
  });
});

//ROUTES API
app.use("/api/products/", productsDbRouter);
app.use("/api/carts/", cartsDbRouter);
app.use("/api/products/file", productsFileRouter);
app.use("/api/carts/file", cartsFileRouter);
