const { Router } = require("express");
const { pointsController } = require("../controllers/points");
const router = Router();

router.post("/accrual", pointsController.accrual);

module.exports = router;
