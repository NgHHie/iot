import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";

const swaggerSpec = yaml.load("./docs/swagger.yaml");

function swaggerDocs(app, port) {
  // Swagger Page
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Documentation in JSON format
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;
