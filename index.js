const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const port = 5000;

const app = express();

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
