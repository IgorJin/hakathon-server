const { Router } = require("express");
const { leaderboard } = require("../controllers/leaderboard");
const router = Router();

router.get("/", leaderboard.get);
