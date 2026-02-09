require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

const contactsRoutes = require("./routes/contacts.routes");

const app = express();

/**
 * ======================
 * CORS CONFIG (FIX)
 * ======================
 */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://cgxppharma.chickenkiller.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// IMPORTANT: preflight
app.options("*", cors());

/**
 * ======================
 * MIDDLEWARES
 * ======================
 */
app.use(express.json());

/**
 * ======================
 * HEALTH CHECK
 * ======================
 */
app.get("/", (req, res) => {
  res.status(200).send("cGxP Pharma Backend API is running");
});

/**
 * ======================
 * ROUTES
 * ======================
 */
app.use("/api/contacts", contactsRoutes);

/**
 * ======================
 * SWAGGER
 * ======================
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * ======================
 * MONGODB
 * ======================
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });

/**
 * ======================
 * ERROR HANDLER
 * ======================
 */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/**
 * ======================
 * SERVER START
 * ======================
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
