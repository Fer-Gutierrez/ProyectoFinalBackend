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

export default router;
