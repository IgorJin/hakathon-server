const { Router } = require("express");
const { authController } = require("../controllers/auth");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = Router();

// /api/auth
router.post("/sign-up", authController.signUp);
router.post("/log-in", authController.logIn);
router.get("refresh", authMiddleware, authController.refresh);

module.exports = router;
