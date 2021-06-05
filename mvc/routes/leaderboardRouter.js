const { Router } = require("express");
const { leaderboard } = require("../controllers/leaderboardController");
const router = Router();

router.get("/", leaderboard.get);
module.exports = router;
