const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// use 'public' folder to access resources and assets like css and image files
app.use(express.static('public'));

app.get('/', function(req, res) {

  // __dirname gets absolute filepath
  res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res) {
  console.log(req.body.password);
});

app.listen(3000, function() {
  console.log("Express started on port 3000");
});
