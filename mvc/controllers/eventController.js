const Event = require("../models/EventModel");
const Participant = require("../models/ParticipantModel");
const { USER_STATUS, USER_TEAM } = require("../../common/consts");

const getOrCreate = async (team = 0, status = 0, userId) => {
  return await Participant.create({
    userId,
    checked: false,
    team,
    status,
  });
};

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

//Пост запрос на запись на мероприятие, пост запрос на чекин

async function addUserToEvent(req, res) {
  try {
    const { eventId, userId, team = 1, status = 1 } = req.body;

    const event = await findEventById(eventId);
    if (!event) throw Error;

    const participant = await getOrCreate(team, status, userId);
    console.log("addUserToEvent -> participant", participant);

    const result = await Event.updateOne(
      { _id: eventId },
      { $push: { participants: participant._id } }
    );

    return res.status(200).send("add user to event");
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
}

const isGoodCoords = (lat, lon, event) =>
  Math.abs(+lat - +event.lat) < 10
    ? Math.abs(+lon - +event.lon) < 10
      ? true
      : false
    : false;

//9e5 == 15 min
const isInTimeBefore = (event) =>
  Math.abs(new Date(event.start).getTime() - Date.now()) < 9e5;

async function checkIn(req, res) {
  try {
    const { eventId, userId, lat, lon } = req.body;

    const event = await findEventById(eventId);
    if (!event) throw Error;

    if (!isGoodCoords(lat, lon, event)) throw Error("bad coordinates");
    if (!isInTimeBefore(event)) throw Error("bad time");

    await Participant.updateOne(
      { userId },
      {
        $set: {
          checked: true,
        },
      }
    );

    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
}

async function endEvent(req, res) {
  try {
    const { eventId } = req.body;

    const event = await Event.updateOne({ _id: eventId }, { isEnded: true });

    return res.status(200).send("ended event");
  } catch (e) {
    return res.sendStatus(400);
  }
}

async function setHostToEvent(req, res) {
  try {
    const { eventId, hostId } = req.body;

    const event = await Event.updateOne({ _id: eventId }, { hostId });

    return res.status(200).send("ended event");
  } catch (e) {
    return res.sendStatus(400);
  }
}

async function getState(event) {
  try {
    if (!event) res.send(400).json({ message: "событие не найдено" });
    const participants = event.participants;

    return await Promise.all(
      participants.map((p) => Participant.find({ _id: p }))
    );
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
  const response = await findEvents();

  return res.status(200).send(response);
}

exports.eventController = {
  getEvents,
  createEvent,
  editEvent,
  setHostToEvent,
  addUserToEvent,
  endEvent,
  findEventById,
  getState,
  checkIn,
};
