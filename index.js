const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const app = express();
const PORT = 3000;

// use "public" folder to access resources and assets like css and image files
app.use(express.static("public"));

// connect (or create if doesn't exist) to database on default port 27017
mongoose.connect("mongodb://localhost:27017/vaxCardUserDB", {useNewUrlParser: true});
// TODO: close database connection at some point

// structure for documents inserted into the db
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Name is required"]
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  imgUrl: String // URL that points to vax card image
});

// creates a User model to access the collection of "user" "s that follow the userSchema
const User = mongoose.model("User", userSchema);

const newUser = new User({
  username: "Bryon",
  password: "password",
  imgUrl: "https://www.vaxcard.com"
});
// newUser.save();

// Allows parsing of incoming HTTP request bodies in the "req" variable
app.use(bodyParser.urlencoded({extended: true}));

// app.use(session({
//   secret: "my secret",
//   resave: false,
//   saveUninitialized: false
// }));
//
// // setup Passport for authentication
// app.use(passport.initialize());
// app.use(passport.session());

app.get("/", function(req, res) {
  // __dirname gets absolute filepath
  console.log("the dirname is: " + __dirname);
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  console.log(req.body.password);
});

app.listen(PORT, function() {
  console.log("Express started on port 3000");
});

function toggleLoginRegister() {
  console.log("toggling");
  alert("worked!");
}
