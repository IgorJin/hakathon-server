const Event = require("../models/EventModel");

const findEventById = async (id) => {
  return await Event.findOne({ _id: id });
};

const findEvents = async () => {
  return await Event.findOne();
};

async function getEvents(req, res) {
  const { id } = req.params;
  try {
    if (id) {
      const event = await findEventById(id);

      if (!event) res.send(400).json({ message: "событие не найдено" });
      return res.send("get event" + id);
    }
  } catch (e) {
    return res.sendStatus(400);
  }
  const response = await findEvents();

  return res.status(200).send(response);
}

async function createEvent(req, res) {
  res.send("add event");
}

async function editEvent(req, res) {
  res.send("edit event");
}

exports.eventController = {
  getEvents,
  createEvent,
  editEvent,
};
