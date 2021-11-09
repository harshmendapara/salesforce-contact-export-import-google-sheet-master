module.exports = function (app) {
  var contact = require("../controllers/contact.controller.js");

  app.get("/contacts-export", contact.exportFile);
};
