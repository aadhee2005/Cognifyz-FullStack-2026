const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Configure EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Display registration form
app.get("/", (req, res) => {
    res.render("index", {
        title: "Cognifyz Internship"
    });
});

// Handle form submission
app.post("/submit", (req, res) => {
    const { name, email, message } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return res.status(400).send("All fields are required.");
    }

    res.render("result", {
        name,
        email,
        message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});