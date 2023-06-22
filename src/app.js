import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import { ProductManager } from "./manager/products.js";

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
  const pm = new ProductManager(`${__dirname}/data/products.json`);
  socket.emit(
    "refreshListProducts",
    JSON.stringify(await pm.getProducts(), null, "\t")
  );
});

//ROUTES API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
