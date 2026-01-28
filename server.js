require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

const contactsRoutes = require("./routes/contacts.routes");

const app = express();

// 🔴 REQUIRED MIDDLEWARES
app.use(cors());
app.use(express.json()); // 🔥 THIS IS VERY IMPORTANT

// Routes
app.use("/api/contacts", contactsRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
