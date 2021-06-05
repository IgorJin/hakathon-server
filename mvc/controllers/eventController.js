const Event = require("../models/EventModel");
const { USER_STATUS, USER_TEAM } = require("../../common/consts");

const findEventById = async (id) => {
  return await Event.findOne({ _id: id });
};

const findEvents = async (limit, skip, moth) => {
  if (moth) {
    const events = await Event.find({})
      .limit(limit)
      .skip(skip)
      .sort({ _id: -1 }); //! добавить сортировку по месяцу в запросе
    return events.filter((e) => new Date(e.date).getMonth() + 1 === moth);
  }

  if (!moth)
    return await Event.find({}).limit(limit).skip(skip).sort({ _id: -1 });
};

async function getEvents(req, res) {
  const { id, limit = 5, page = 1, moth } = req.params;
  const skip = limit * (page - 1);

  try {
    if (id) {
      const event = await findEventById(id);

      if (!event) res.send(400).json({ message: "событие не найдено" });
      return res.json(event);
    }
    if (moth) {
      const events = await findEvents(limit, skip, moth);
      return res.json(events);
    }
    const response = await findEvents(limit, skip);
    return res.json(response);
  } catch (e) {
    return res.sendStatus(400);
  }

  return res.status(200).send(response);
}

async function createEvent(req, res) {
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
