const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const port = 5000;

const app = express();

// import mongoose schema
require('./models/Goal');
const Goal = mongoose.model('goals');

mongoose
  .connect('mongodb://vladtrebukhov:vlad123@ds019638.mlab.com:19638/goalsapp', {
    useNewUrlParser: true
  })
  .then(() => console.log('Connected to database'))
  .catch(error => console.log(error));

// middleware
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

// Middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());
app.use(methodOverride('_method'))

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

app.get('/', (req, res) => {
  const title = '#Goals';
  res.render('homepage', {
    title: title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/goals/add', (req, res) => {
  res.render('addgoals');
});

app.get('/goals/edit/:id', (req, res) => {
  Goal.findOne({
    _id: req.params.id
  }).then(goal =>
    res.render('edit', {
      goal: goal
    })
  );
});

app.get('/goals', (req, res) => {
  Goal.find({})
    .sort({
      date: 'desc'
    })
    .then(goals => {
      res.render('goals', {
        goals: goals
      });
    });
});

// bodyparser middleware is required to catch the values from the form
app.post('/goals', (req, res) => {
  let errors = [];

  if (!req.body.name) {
    errors.push({
      text: 'Please enter a name for your goal.'
    });
  }

  if (!req.body.details) {
    errors.push({
      text: 'Please enter some details for your goal.'
    });
  }

  if (errors.length > 0) {
    res.render('addgoals', {
      errors: errors,
      name: req.body.name,
      details: req.body.details
    });
  } else {
    // save to database
    const newUser = {
      name: req.body.name,
      details: req.body.details
    };

    new Goal(newUser).save().then(goal => {
      res.redirect('/goals');
    });
  }
});

// Edit form processing
//* * must use the module method-override here because we can't just change
// the POST request to a PUT request inside the form of edit.handlebars */
app.put('/goals/:id', (req, res) => {
  Goal.findOne({
    _id: req.params.id
  }).then(goal => {
    // new values
    goal.name = req.body.name;
    goal.details = req.body.details;

    goal.save()
      .then(goal => {
        res.redirect('/goals');
      });
  })
})
