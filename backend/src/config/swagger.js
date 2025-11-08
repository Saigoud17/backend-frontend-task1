const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task Management API",
            version: "1.0.0",
            description: "API documentation for the Backend Developer Assignment project by Sai Kiran Goud Bathini.",
        },
        servers: [{
            url: "http://localhost:4000",
            description: "Local server",
        }, ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{
            bearerAuth: [],
        }, ],
    },
    apis: ["./src/routes/*.js"], // path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📘 Swagger Docs available at /api-docs");
};

module.exports = swaggerDocs;