const swaggerJsdoc = require("swagger-jsdoc");

const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "https://cgxp-pharma-api.onrender.com"
    : "http://localhost:5000";

module.exports = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "cGxP Pharma Contacts API",
      version: "1.0.0",
      description: `
API documentation for cGxP Pharma Contacts Management System.

This API powers the AG Grid based UI used to:
- View pharma contacts
- Edit records inline
- Persist updates to MongoDB

Tech Stack:
- Node.js
- Express
- MongoDB Atlas
- Swagger (OpenAPI 3.0)
      `,
      contact: {
        name: "cGxP Tech",
        email: "support@cgxptech.com",
      },
    },

    servers: [
      {
        url: SERVER_URL,
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Local development server",
      },
    ],

    tags: [
      {
        name: "Contacts",
        description: "Operations related to pharma contacts",
      },
    ],

    components: {
      schemas: {
        Contact: {
          type: "object",
          properties: {
            _id: { type: "string" },
            externalId: { type: "number" },
            name: { type: "string" },
            title: { type: "string" },
            level: { type: "string" },
            company: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            linkedin: { type: "string" },
            unlocked: { type: "boolean" },
            unlocked_company: { type: "boolean" },
            email_check_status: { type: "string" },
            linkedin_check_status: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },

  apis: ["./routes/*.js"],
});
