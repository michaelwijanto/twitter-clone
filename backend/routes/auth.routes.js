import express from "express";

const router = express.Router();

router.post("/signup", (req, res) => {
  res.json({
    data: "Signup endpoint",
  });
});

router.post("/login", (req, res) => {
  res.json({
    data: "Login endpoint",
  });
});

router.post("/logout", (req, res) => {
  res.json({
    data: "Logout endpoint",
  });
});

export default router;
