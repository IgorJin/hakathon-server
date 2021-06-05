exports.pointsAccrual = (eventID, factor) => {
  const event = await Event.findById(eventID);
  if (!event) res.status(400);
  event.protocol &&
    event.protocol.forEach((element) => {
      const newPointsCout =
        CONSTANT_ALL_BALLS[event.sportID][element.appearance];
      await UserSchema.findByIdAndUpdate(element.participantID, {
        points: newPointsCout * factor,
      });
    });
};
