import swaggerAutogen from "swagger-autogen";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const doc = {
  info: {
    version: "1.0.0",
    title: "Clooper Property Manager",
    description:
      "This is a property manager built with Express.js, TypeScript and Mongoose",
  },
  // host: "http://localhost:3020",
  host: "https://henzyd-clooper.onrender.com",
};

const outputFile = `docs/swagger_output.json`;
const endpointsFiles = [`dist/app.js`];

swaggerAutogen(outputFile, endpointsFiles, doc);
