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

    if (!productName || !quantity || quantity <= 0 || !(parseInt(quantity, 10) === quantity)) {
        return res.status(400).json({ error: "Invalid product name or quantity" });
    }

    else if (!['cheerios', 'cornflakes', 'frosties', 'shreddies', 'weetabix'].includes(productName)) {
        return res.status(404).json({ error: "Invalid product name" })
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});