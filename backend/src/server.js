const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { sequelize } = require("./models");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const errorHandler = require("./middleware/errorHandler");
const swaggerDocs = require("./config/swagger");

// ✅ Initialize Express app
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// ✅ Swagger Docs (after routes)
swaggerDocs(app);

// ✅ Root route
app.get("/", (req, res) => {
    res.send("🚀 Task API is running successfully!");
});

// ✅ Database connection
sequelize
    .authenticate()
    .then(() => {
        console.log("✅ Database connected successfully");
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err.message);
    });

// ✅ Global error handler (after all routes)
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));