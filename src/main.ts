import dotenv from "dotenv";
import "reflect-metadata";
import * as DbInstance from "./config/db";
import express, { Request as ExRequest, Response as ExResponse, NextFunction, urlencoded } from "express"; 
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import fs from 'fs';
import { RegisterRoutes } from "../dist/routes";
import path from 'path';
import { exceptionHandler, notFoundHandler } from "./config/exception-handler";
import cron from "node-cron";
import { cryptoPriceQuotationService, orderService } from "./config/dependencies";


export const app = express();
const NODE_ENV = process.env.NODE_ENV;

dotenv.config();

const PORT = process.env.PORT;

async function main() {
  console.log("Initializing server at: ", NODE_ENV);
  let swaggerDir;

  if (NODE_ENV === 'PROD') {
    swaggerDir = path.join(__dirname, '..', 'swagger.json')
  } else {
    swaggerDir = path.join(__dirname, '..', 'dist', 'swagger.json')
  }

  await DbInstance.default.initialize()
  console.log("Database connected")

  cron.schedule('*/30 * * * *', async () => {
      await cryptoPriceQuotationService.updatePrices();
      await orderService.expire()
      console.log("crypto price quotations updated!")
  })

  app.use(
    urlencoded({
      extended: true,
    })
  );
  app.use(express.json())
  app.use(morgan("tiny"));

  RegisterRoutes(app);

  const swaggerJson = JSON.parse(fs.readFileSync(swaggerDir, 'utf8'));

  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerJson)
  );

  app.use((_req: ExRequest, res: ExResponse) => notFoundHandler(_req, res))

  app.use((err: unknown, req: ExRequest, res: ExResponse, next: NextFunction) => {
    return exceptionHandler(err, req, res, next);
  })

  app.listen(PORT, () => { 
    console.log("Server running at PORT: ", PORT); 
  }).on("error", (error) => {
    throw new Error(error.message);
  });
}

main();