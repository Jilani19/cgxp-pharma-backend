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
 * GLOBAL MIDDLEWARES
 * ======================
 */
app.use(cors());
app.use(express.json()); // REQUIRED for POST / PUT JSON body

/**
 * ======================
 * HEALTH CHECK (ROOT)
 * ======================
 */
app.get("/", (req, res) => {
  res.send("cGxP Pharma Backend API is running");
});

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
 * SWAGGER DOCS
 * ======================
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * ======================
 * MONGODB CONNECTION
 * ======================
 */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

/**
 * ======================
 * GLOBAL ERROR HANDLER
 * ======================
 */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
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
