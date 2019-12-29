const express = require('express');
const app = express();
const session = require('express-session');
// Template Engine
app.set('view engine', 'ejs');
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});
app.use('/assets',express.static('assets'));
var control = require('./controllers/control');
var schema = require("./controllers/schema");
app.set('trust proxy', 1);
app.use(session({
  secret: 'adagama',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
var schemas = schema.setSchema(app);
control.reqManager(app, __dirname,schemas);
app.listen(3000);
