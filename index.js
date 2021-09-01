const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
LocalStrategy = require('passport-local').Strategy;
const app = express();
const PORT = 3000;

// use "public" folder to access resources and assets like css and image files
app.use(express.static("public"));

// Allows parsing of incoming HTTP request bodies in the "req" variable
app.use(bodyParser.urlencoded({
  extended: true
}));

// session intial configuration
app.use(session({
  secret: "my secret",
  resave: false,
  saveUninitialized: false
}));

// setup Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// connect (or create if doesn't exist) to database on default port 27017
mongoose.connect("mongodb://localhost:27017/vaxCardUserDB", {
  useNewUrlParser: true
});
// TODO: close database connection at some point

// structure for documents inserted into the db
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  imgUrl: String // URL that points to vax card image
});

// to salt and hash our passwords and save users into database
userSchema.plugin(passportLocalMongoose);

// creates a User model to access the collection of "user"s that follow the userSchema
const User = mongoose.model("User", userSchema);

// use default local strategy that looks for html name fields "username", " password"
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// const newUser = new User({
//   username: "Bryon",
//   password: "password",
//   imgUrl: "https://www.vaxcard.com"
// });
// newUser.save();

app.get("/", function(req, res) {
  // if user is logged in
  // if(req.isAuthenticated) {
  //   res.redirect("/loggedIn");
  // }
  // __dirname gets absolute filepath
  console.log("the dirname is: " + __dirname);
  res.sendFile(__dirname + "/index.html");
});

app.get("/loggedIn", function(req, res) {
  if (req.isAuthenticated) {
    res.sendFile(__dirname + "/loggedIn.html");
  } else {
    res.redirect("/");
  }
});

app.post("/register", function(req, res) {
  console.log(req.body.email + " " + req.body.password + " " + req.body.password2);

  // register method comes from passport-local-mongoose package, don't have to
  // manually create new User. Default looks for html name fields "username", "password"
  User.register({username: req.body.username}, req.body.password, function(err, newUser) {
    console.log("newUser: " + newUser);
    if (err) {
      console.log("the error is: " + err);
      res.redirect("/");
    } else {

      // authenticate using local strategy, callback triggered on success
      passport.authenticate("local")(req, res, function() {
        console.log("authentication successful");
        res.redirect("/loggedIn"); // goes to loggedIn route
      });
    }
  });
});

app.post("/login", function(req, res) {
  console.log(req.body.username + " " + req.body.password);
});

app.post("/logout", function(req, res) {
  console.log(req.body);
  req.logout();
  res.redirect("/");
});

app.listen(PORT, function() {
  console.log("Express started on port 3000");
});
