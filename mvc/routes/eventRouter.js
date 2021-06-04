const { Router } = require("express");
const { eventController } = require("../controllers/eventController");
const router = Router();

// /api/auth
router.post("/", eventController.createEvent);
router.put("/", eventController.editEvent);
router.get("/:id*?", eventController.getEvents);

module.exports = router;
