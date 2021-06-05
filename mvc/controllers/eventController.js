const Event = require("../models/EventModel");
const { USER_STATUS, USER_TEAM } = require("../../common/consts");

const findEventById = async (id) => {
  return await Event.findOne({ _id: id });
};

const findEvents = async () => {
  return await Event.find();
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
  console.log(req.body);
  try {
    const { userId: creator, departmentId, sportId } = req.body;

    const event = await Event.create({ creator, departmentId, sportId });

    return res.send("add event" + event.id);
  } catch (e) {
    return res.sendStatus(400);
  }
}

async function editEvent(req, res) {
  res.send("edit event");
}

async function addUserToEvent(req, res) {
  try {
    const { eventId, userId, team, status } = req.body;
    const participant = {
      userId,
      team,
      status,
    };
    const event = await Event.updateOne(
      { _id: eventId },
      { $push: { participants: participant } }
    );

    return res.status(200).send("add user to event");
  } catch (e) {
    return res.sendStatus(400);
  }
}



exports.eventController = {
  getEvents,
  createEvent,
  editEvent,
  addUserToEvent,
};
