const { Router } = require("express");
const { authController } = require("../controllers/auth");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = Router();

// /api/auth
router.post("/log-in", authController.logIn);

module.exports = router;
