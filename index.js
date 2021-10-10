const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
require('dotenv').config(); // to access sensitive information in .env file

// local strategy is used to login with username and password
LocalStrategy = require('passport-local').Strategy;

// used to upload/download image files
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const { uploadImage } = require('./s3');

// used to delete images from local storage
const fs = require('fs'); // gain access to file system
const util = require('util');
const deleteImage = util.promisify(fs.unlink);

// Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport.
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const PORT = 3000;

// use "public" folder to access resources and assets like CSS and image files
app.use(express.static("public"));

// allows parsing of incoming HTTP request bodies in the "req" variable
app.use(bodyParser.urlencoded({ extended: true }));

// session initial configuration TODO use ENVIRONMENT VARIABLE FILE (process.env)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// setup Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

app.use(flash()); // flashes messages to user on various events

// connect (or create if doesn't exist) to database on default port 27017
mongoose.connect("mongodb://localhost:27017/vaxCardUserDB", {
  useNewUrlParser: true
});

// schema structure for documents inserted into the db
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  imgUrl: String // URL that points to vax card image
});

// to salt and hash our passwords when saving users into database
userSchema.plugin(passportLocalMongoose);

// creates a User model to access the collection of "user"s that follow the userSchema
const User = mongoose.model("User", userSchema);

// createStrategy() method comes from passport-local-mongoose - use default local
// strategy that looks for html name fields "username", " password"
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {

  // if user is logged in, redirect to different route
  if (req.isAuthenticated()) {
    res.redirect("/loggedIn");
    return;
  }
  // __dirname gets absolute filepath
  res.sendFile(__dirname + "/index.html");
});

// home page for authenticated users
app.get("/loggedIn", function(req, res) {
  if (req.isAuthenticated()) {
    console.log(req.user);
    if(req.user.imgUrl) {
      console.log(req.user.imgUrl); // display the image at this URL
    }
    res.sendFile(__dirname + "/account.html");
  } else {
    res.redirect("/");
  }
});

// registration inserts user into database
app.post("/register", function(req, res) {

  // register method comes from passport-local-mongoose package, don't have to
  // manually create new User. Default looks for html name fields "username", "password"
  User.register({
    username: req.body.username
  }, req.body.password, function(err, newUser) {
    if (err) {
      res.redirect("/");
    } else {

      // authenticate using local strategy, callback triggered on success
      passport.authenticate("local")(req, res, function() {
        res.redirect("/loggedIn"); // goes to loggedIn route
      });
    }
  });
});


app.post('/login', passport.authenticate('local', { successRedirect: '/loggedIn',
  failureRedirect: '/flash',
  failureFlash: true }));

app.post('/images', upload.single('cardImage'), async function(req, res) {
  const imageFile = req.file;
  const result = await uploadImage(imageFile); // upload image to AWS S3 bucket
  await deleteImage(imageFile.path); // delete locally stored image
  const email = req.user.username; // currently logged in user
  const imageUrl = result.Location; // s3 bucket URL where image is stored
  addImageUrlToUser(email, imageUrl);
});

// update user record to insert Amazon S3 bucket link to vaccine card image
async function addImageUrlToUser(email, imageUrl) {
  const user = await User.findOneAndUpdate({username: email}, {imgUrl: imageUrl}, {new: true});
}

app.get('/flash', function(req, res) {
  req.flash('invalid', "Invalid username or password");
  res.redirect('/');
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(PORT, function() {
  console.log("Express started on port 3000");
});
