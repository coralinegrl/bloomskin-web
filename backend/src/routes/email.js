import express from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { sendTransactionalEmail } from "../services/brevo.js";

const router = express.Router();

const emailSchema = z.object({
  to: z.string().trim().email(),
  subject: z.string().trim().min(3).max(140),
  htmlContent: z.string().trim().min(3),
  textContent: z.string().trim().min(3).optional(),
});

router.post("/send-test", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const payload = emailSchema.parse(req.body);
    const response = await sendTransactionalEmail(payload);
    return res.status(201).json({
      message: "Email sent",
      brevoMessageId: response?.body?.messageId || null,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
