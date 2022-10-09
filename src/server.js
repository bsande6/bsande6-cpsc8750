// use the express library
const express = require('express');
const cookieParser = require('cookie-parser');


// create a new server application
const app = express();

app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');
// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;

var nextVisitorId = 1
var last_visit = 0
// The main page of our website
app.get('/', (req, res) => {
  if (!req.cookies['visitorId']) { 
    res.cookie('visitorId', nextVisitorId++);
  }
  if (!req.cookies['visited']) {
    last_visit = -1
  }
  else {
    last_visit = Math.floor((Date.now().toString() - req.cookies['visited']) / 1000)
  }
  if (last_visit == -1) {
    output = "You have never visited before";
  }
  else {
    output = "It has been " + last_visit + " seconds since your last visit"
  }
 
  res.cookie('visited', Date.now().toString());
  
  res.render('welcome', {
    name: req.query.name || "World",
    Date: req.query.Date || Date().toLocaleString(),
    id: req.query.id ||  req.cookies['visitorId'],
    output: req.query.output || output
  });
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");