const express = require("express");
const axios = require("axios");
const session = require("express-session");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
  session({
    secret: "cart-secret",
    resave: false,
    saveUninitialized: true,
  })
);

const TAX_RATE = 0.125;

// Middleware to initialize cart in session
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });