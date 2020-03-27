module.exports = app => {
  const users = require("./user.routes.js");
  const groups = require("./group.routes.js")

  app.use('/users', users);
  app.use('/groups', groups);
};
