module.exports = app => {
  const users = require("./user.routes.js");
  const groups = require("./group.routes.js");
  const user_groups = require("./user_group.routes.js");
  const meetings = require("./meeting.routes.js");
  const rooms = require("./room.routes.js");
  const schedules = require("./schedule.routes.js");
  const meeting_data = require("./meeting_data.routes.js");

  app.use('/users', users);
  app.use('/groups', groups);
  app.use('/', user_groups);
  app.use('/meetings', meetings);
  app.use('/meetings/rooms', rooms);
  app.use('/schedules', schedules);
  app.use('/meetings', meeting_data);
};
