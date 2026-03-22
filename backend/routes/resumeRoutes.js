const express = require("express");
const multer = require("multer");
const r = express.Router();
const ctrl = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = [".pdf", ".txt"].includes(require("path").extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error("Only PDF/TXT allowed"), ok);
  }
});

r.use(protect);
r.get("/", ctrl.getResumes);
r.post("/", ctrl.createResume);
r.post("/upload", upload.single("resume"), ctrl.uploadResume);
r.post("/text", ctrl.submitText);
r.get("/:id", ctrl.getResume);
r.put("/:id", ctrl.updateResume);
r.delete("/:id", ctrl.deleteResume);
module.exports = r;
