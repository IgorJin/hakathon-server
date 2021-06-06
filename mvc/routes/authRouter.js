const { Router } = require("express");
const { authController } = require("../controllers/auth");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = Router();

// /api/auth
router.post("/login", authController.logIn);
router.post("/activate", authController.activate);
router.post("/restore", authController.restore);

module.exports = router;
