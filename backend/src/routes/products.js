import express from "express";
import { z } from "zod";
import { query } from "../db/pool.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

const productSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  descripcion: z.string().trim().min(2).max(400),
  precio: z.coerce.number().nonnegative(),
  imagen: z.string().trim().url(),
  stock: z.coerce.number().int().nonnegative(),
});

const stockSchema = z.object({
  stock: z.coerce.number().int().nonnegative().optional(),
  delta: z.coerce.number().int().optional(),
});

router.get("/", async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, nombre, descripcion, precio, imagen, stock, created_at, updated_at
       FROM products ORDER BY created_at DESC`
    );
    return res.json(result.rows);
  } catch (error) {
    return next(error);
  }
});

router.post("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const payload = productSchema.parse(req.body);
    const result = await query(
      `INSERT INTO products (nombre, descripcion, precio, imagen, stock)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, descripcion, precio, imagen, stock, created_at, updated_at`,
      [payload.nombre, payload.descripcion, payload.precio, payload.imagen, payload.stock]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const payload = productSchema.parse(req.body);
    const result = await query(
      `UPDATE products
       SET nombre = $1, descripcion = $2, precio = $3, imagen = $4, stock = $5, updated_at = now()
       WHERE id = $6
       RETURNING id, nombre, descripcion, precio, imagen, stock, created_at, updated_at`,
      [payload.nombre, payload.descripcion, payload.precio, payload.imagen, payload.stock, req.params.id]
    );
    if (!result.rowCount) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id/stock", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const payload = stockSchema.parse(req.body);
    const result = await query("SELECT id, stock FROM products WHERE id = $1 LIMIT 1", [req.params.id]);
    if (!result.rowCount) {
      return res.status(404).json({ message: "Product not found" });
    }

    const current = result.rows[0];
    const nextStock =
      typeof payload.stock === "number"
        ? payload.stock
        : Math.max(0, current.stock + (payload.delta || 0));

    const updated = await query(
      `UPDATE products SET stock = $1, updated_at = now()
       WHERE id = $2
       RETURNING id, nombre, descripcion, precio, imagen, stock, created_at, updated_at`,
      [nextStock, req.params.id]
    );

    await query(
      `INSERT INTO inventory_movements (product_id, changed_by, previous_stock, new_stock, delta)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.params.id, req.user.sub, current.stock, nextStock, nextStock - current.stock]
    );

    return res.json(updated.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const result = await query("DELETE FROM products WHERE id = $1 RETURNING id", [req.params.id]);
    if (!result.rowCount) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
