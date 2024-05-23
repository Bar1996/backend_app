import express from "express";
import multer from "multer";

const router = express.Router();

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

/**
 * @swagger
 * tags:
 *   name: File Upload
 *   description: The File Upload API
 */

/**
 * @swagger
 * /file/upload:
 *  post:
 *      summary: Upload a file
 *      tags: [File Upload]
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          file:
 *                              type: string
 *                              format: binary
 *      responses:
 *          200:
 *              description: File uploaded successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: Success message
 *                              url:
 *                                  type: string
 *                                  description: URL of the uploaded file
 *                          example:
 *                              message: "Uploaded successfully"
 *                              url: "http://172.20.10.3:3000/uploads/filename.jpg"
 *          400:
 *              description: No file uploaded
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: Error message
 *                          example:
 *                              message: "No file uploaded"
 */
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
