// use the express library
const express = require('express');
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');


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

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

app.get("/trivia", async (req, res) => {
  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

  // fail if bad response
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }

  // interpret the body as json
  const content = await response.json();

  // fail if db failed
  if (content.response_code !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${data.response_code}`);
    return;
  }

  // respond to the browser
  // TODO: make proper html
  //res.send(JSON.stringify(content, 2));
  console.log(content)
  console.log(content['results'][0]['answers'])
  //answers=content['results'][0]['incorrect_answers']
  //answers.push(content['results'][0]['incorrect_answers'])
  //answers.push(content['results'][0]['correct_answers'])
  const correctAnswer = content['results'][0]['correct_answer'];
  let answers = content['results'][0]['incorrect_answers'];
  answers.push(content['results'][0]['correct_answer'])

  const answerLinks = answers.map(answer => {
    return `<a href="javascript:alert('${
      answer === correctAnswer ? 'Correct!' : 'Incorrect, Please Try Again!'
      }')">${answer}</a>
    `
  })
  
  res.render('trivia', {
    question: req.query.question || content['results'][0]['question'],
    answers: req.query.answers || answerLinks,
    category: req.query.category || content['results'][0]['category'],
    difficulty: req.query.difficulty || content['results'][0]['difficulty']
  })
});
// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");