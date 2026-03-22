function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err.message);
  if (err.code === "LIMIT_FILE_SIZE") return res.status(400).json({ error: "File too large. Max 10MB" });
  if (err.name === "ValidationError") return res.status(400).json({ error: err.message });
  if (err.code === 11000) return res.status(400).json({ error: "Email already exists" });
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
}
module.exports = errorHandler;
