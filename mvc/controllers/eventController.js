const Event = require("../models/EventModel");
const Participant = require("../models/ParticipantModel");
const { USER_STATUS, USER_TEAM } = require("../../common/consts");


const getOrCreate = async (socket, team = 0, status = 0, userId = 0) => {
  return await Participants.findOneAndUpdate(
    { userId },
    {
      $set: {
        connection: "online",
        checked: true,
        socketId: socket.id,
        userId,
        team,
        status
      },
    },
    { new: true }
  );
};

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
    
    const participant = await getOrCreate('', team, status, userId)
    const event = await Event.updateOne(
      { _id: eventId },
      { $push: { participants: participant._id } }
    );

    return res.status(200).send("add user to event");
  } catch (e) {
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

    return await Promise.all(participants.map(p => Participant.find({_id : p})))
  } catch (e) {
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
};
