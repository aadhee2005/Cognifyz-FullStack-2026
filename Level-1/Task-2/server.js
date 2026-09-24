const express = require("express");
const path = require("path");

const app = express();
const PORT = 3001;

// Temporary server-side storage
const applications = [];

// EJS configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Display form
app.get("/", (req, res) => {
    res.render("index");
});

// Handle form submission
app.post("/submit", (req, res) => {
    const { name, email, phone, course, message } = req.body;

    // Server-side validation
    if (
        !name?.trim() ||
        !email?.trim() ||
        !phone?.trim() ||
        !course ||
        !message?.trim()
    ) {
        return res.status(400).send("Please fill in all fields.");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!emailPattern.test(email.trim())) {
        return res.status(400).send("Invalid email address.");
    }

    if (!phonePattern.test(phone.trim())) {
        return res.status(400).send("Phone number must contain 10 digits.");
    }

    // Store validated application temporarily
    const application = {
        id: applications.length + 1,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        course,
        message: message.trim(),
        submittedAt: new Date().toLocaleString()
    };

    applications.push(application);

    // Render confirmation page
    res.render("success", { application });
});

// View temporary stored applications
app.get("/applications", (req, res) => {
    res.json(applications);
});

// Start server
app.listen(PORT, () => {
    console.log(`Task 2 server running at http://localhost:${PORT}`);
});