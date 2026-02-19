export function notFoundHandler(req, res) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(error, req, res, next) {
  if (error?.name === "ZodError") {
    return res.status(400).json({
      message: "Validation error",
      issues: error.issues,
    });
  }

  const status = error.status || 500;
  const message = error.message || "Internal server error";
  return res.status(status).json({ message });
}
