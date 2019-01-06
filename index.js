const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const port = 5000;

const app = express();

// import mongoose schema
require('./models/Goal');
const Goal = mongoose.model('goals');

// middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})

app.get('/', (req, res) => {
  const title = '#Goals';
  res.render('homepage', {
    title: title
  });
})

app.get('/about', (req, res) => {
  res.render('about');
})

app.get('/goals/add', (req, res) => {
  res.render('addgoals');
})


// bodyparser middleware is required to catch the values from the form
app.post('/goals', (req, res) => {
  let errors = [];

  if (!req.body.name) {
    errors.push({
      text: 'Please enter a name for your goal.'
    })
  }

  if (!req.body.details) {
    errors.push({
      text: 'Please enter some details for your goal.'
    })
  }

  if (errors.length > 0) {
    res.render('addgoals', {
      errors: errors,
      name: req.body.name,
      details: req.body.details
    })
  } else {
    res.send('ok')
  }
})
