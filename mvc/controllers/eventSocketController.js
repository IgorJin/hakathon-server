const { eventController } = require("../controllers/eventController");
const Participants = require("../models/ParticipantModel");
const Event = require("../models/EventModel");
const Message = require("../models/MessageModel");

const createMessage = async (participant, eventId, text) => {
  await Message.remove({});
  await Message.create({ participant, eventId, text });
  return Message.find();
};

const getBySocketId = async (socketId) => {
  return await Participants.findOne({ socketId });
};

const setParticipantStatus = async (participant, connection) => {
  return Participants.findOneAndUpdate(
    { _id: participant._id },
    { $set: { connection } },
    { new: true }
  );
};

const getOrCreate = async (socket, eventId, userId) => {
  let participant = await Participants.findOneAndUpdate(
    { userId },
    {
      $set: {
        connection: "online",
        checked: true,
        socketId: socket.id,
        userId,
        team: 0,
        status: 0,
      },
    },
    { new: true }
  );

  if (!participant) {
    participant = await Participants.create({
      userId,
      connection: "online",
      checked: true,
      socketId: socket.id,
      userId,
      team,
      status,
    });
  }

  const event = await Event.updateOne(
    { _id: eventId },
    { $push: { participants: participant._id } }
  );
  return true;
};

async function disconnect(io, socket) {
  try {
    const participant = await getBySocketId(socket.id);
    if (!participant) {
      return;
    }

    await setParticipantStatus(participant, "offline");

    // const ownerId = conference.owner.toString();
    // io.to(`${ownerId}-own-rooms`).emit("conference:rooms:update", await Conference.getOwnRoomState(ownerId));
  } catch (e) {
    console.log(e);
  }
}

// const getOnlineParticipant = async (socketId) => {
//   return await Participants.findOne(
//     { socketId, connection: "online" }
//   );
// }

// const addNewSocket = async (event, userId) => {
//   return await Participants
// }

async function join(io, socket, data, callback) {
  try {
    const { eventId, userId } = data;
    const event = await eventController.findEventById(eventId);

    if (!event) throw Error;

    // const participant = await getOnlineParticipant(socket.id);
    // console.log("join -> participant", participant)

    await socket.join(event.id);

    // if (participant.isConferenceOwner) {
    //   await socket.join(`${roomId}-owners`);
    // }

    const newParticipant = await getOrCreate(socket, event.id, userId);

    const newParticipantsState = await eventController.getState(event);

    io.to(event.id).emit("event:participants:state", newParticipantsState);
    // const ownerId = event.owner.toString();
    // io.to(`${ownerId}-own-rooms`).emit("event:rooms:update", await Conference.getOwnRoomState(ownerId));
  } catch (e) {
    console.error(e);
  }
}

const getParticipantBySocketId = async (socketId) =>
  await Participants.findOne({ socketId });

async function takeMessage(io, socket, data) {
  const { eventId, text } = data;

  const participant = await getParticipantBySocketId(socket.id);

  if (!participant) throw Error("dont have participant");

  const messages = await createMessage(participant, eventId, text);

  io.to(eventId).emit("event:messages", { messages });
}

async function testMessage(io, socket, data) {
  await Message.remove({});

  console.log("HERE POST TEST MSG:  ==== > ", data);
}

module.exports = {
  join,
  disconnect,
  testMessage,
  getOrCreate,
  takeMessage,
};
