const swaggerJsdoc = require("swagger-jsdoc");

module.exports = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "cGxP Pharma Contacts API",
      version: "1.0.0",
      description: `
API documentation for cGxP Pharma Contacts Management System.

This API powers the Ag-Grid based UI used to:
- View pharma contacts
- Edit records inline
- Persist updates to database

Tech Stack:
- Node.js
- Express
- MongoDB
- Swagger (OpenAPI 3.0)
      `,
      contact: {
        name: "cGxP Tech",
        email: "support@cgxptech.com"
      }
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server"
      }
      // Later you can add:
      // {
      //   url: "https://cgxp-pharma-api.onrender.com",
      //   description: "Production server"
      // }
    ],
    tags: [
      {
        name: "Contacts",
        description: "Operations related to pharma contacts"
      }
    ]
  },
  apis: ["./routes/*.js"]
});
