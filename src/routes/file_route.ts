import express from "express";
import multer from "multer";

const router = express.Router();
// TODO add swagger documentation

const base = "http://172.20.10.3:3000/uploads/";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), (req, res) => {
  console.log("uploading file");
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  console.log("check: " + base + req.file.filename);
  res
    .status(200)
    .json({ message: "Uploaded successfully", url: base + req.file.filename });
});

export default router;
