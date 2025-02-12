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

// Fetch product price from external Price API
const getProductPrice = async (productName) => {
    try {
        const response = await axios.get(` http://localhost:3001/products/${productName}`);
        return response.data.price;
    } catch (error) {
        console.error("Error fetching product price:", error);
        throw new Error("Could not retrieve product price");
    }
};

// Add product to cart
app.post("/cart/add", async (req, res) => {
    const { productName, quantity } = req.body;

    // Basic validation

    if (!quantity || quantity <= 0 || !(parseInt(quantity, 10) === quantity)) {
        return res.status(400).json({ error: "Invalid product quantity", cart: req.session.cart  });
    }

    else if (!['cheerios', 'cornflakes', 'frosties', 'shreddies', 'weetabix'].includes(productName)) {
        return res.status(404).json({ error: "Invalid product name", cart: req.session.cart })
    }

    try {
        const price = await getProductPrice(productName);
        let cart = req.session.cart
        const existingItem = cart.find(item => item.productName === productName);

        // If single quantity exists , add more to it.
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.total = existingItem.quantity * price;
        } else {
            cart.push({ productName, quantity, total: price * quantity });
        }
        req.session.cart = cart;
        res.json({ message: "Product added to cart", cart: req.session.cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get cart state with calculated totals
app.get("/cart", (req, res) => {
    const cart = req.session.cart;
    if (!cart.length) {
      return res.json({ message: "Cart is empty", cart, subtotal: 0, tax: 0, total: 0 });
    }
  
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.round((subtotal * TAX_RATE+Number.EPSILON)*100)/100;
    const total = Math.round((subtotal + tax + Number.EPSILON) * 100) / 100;
  
  
    res.json({cart:cart, subtotal:subtotal, tax:tax, total:total });
  });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app