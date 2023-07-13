import express from "express";

const router = express.Router();

//HOME:
router.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
  });
});

//REAL TIME PRODUCTS:
router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    title: "Real Time Producst",
  });
});

//CHAT
router.get("/chat", (req, res) => {
  res.render("chat", {
    title: "Chat",
    styles: "css/styles.css"
  });
});

export default router;
