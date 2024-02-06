const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("post get");
});

router.get("/:id", (req, res) => {
  res.send("post get by id");
});

router.post("/", (req, res) => {
  res.send("post post" + req.body);
});

router.put("/:id", (req, res) => {
  res.send("post put");
});

router.delete("/:id", (req, res) => {
  res.send("post delete");
});

module.exports = router;