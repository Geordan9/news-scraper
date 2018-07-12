const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const db = require("./models");

const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const app = express();

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect(MONGODB_URI);

require("./routes/html-routes.js")(app, db);
require("./routes/api-routes.js")(app, db);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});