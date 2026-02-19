import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { query } from "./db/pool.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import emailRoutes from "./routes/email.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (req, res, next) => {
  try {
    await query("SELECT 1");
    res.json({ status: "ok" });
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/email", emailRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Bloomskin API listening on http://localhost:${env.port}`);
});
