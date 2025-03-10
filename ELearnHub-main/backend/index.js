const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");
const fs = require("fs");
const DBConnection = require('./config/connect');

dotenv.config(); // Load .env variables at the very beginning

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure essential .env variables exist
if (!process.env.MONGO_DB) {
    console.error("❌ MONGO_DB environment variable is missing!");
    process.exit(1);
}

// Ensure 'uploads/' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Ensure nested directories are created
    console.log("✅ 'uploads/' directory created");
}

// Connect to MongoDB
DBConnection();

// Middleware
app.use(cors()); // Ensure CORS is set before other middlewares
app.use(express.json()); // Parses incoming JSON requests
app.use("/uploads", express.static(uploadDir)); // Serve static files

// Routes
app.use('/api/admin', require('./routers/adminRoutes'));
app.use('/api/user', require('./routers/userRoutes'));

// Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
