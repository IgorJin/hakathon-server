const {
  join,
  disconnect,
  testMessage,
  takeMessage,
} = require("../controllers/eventSocketController");

function listenEvent(io, socket, event, handler) {
  socket.on(event, (data, callback) => {
    try {
      handler(io, socket, data, callback);
    } catch (e) {
      callback({ error: e.toString() });
    }
  });
}

module.exports = (io, socket) => {
  listenEvent(io, socket, "event:join", join);
  listenEvent(io, socket, "disconnect", disconnect);
  listenEvent(io, socket, "test:message", testMessage);
  listenEvent(io, socket, "event:send-message", takeMessage);
};
