const { Router } = require("express");
const { userController } = require("../controllers/userController");
const router = Router();

router.get("/", userController.profile);
router.get("/:id/team", userController.team);

module.exports = router;
