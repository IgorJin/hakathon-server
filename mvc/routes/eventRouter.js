const { Router } = require("express");
const { eventController } = require("../controllers/eventController");
const router = Router();

router.post("/", eventController.createEvent);

router.put("/", eventController.editEvent);

router.get("/:id*?", eventController.getEvents);

module.exports = router;
