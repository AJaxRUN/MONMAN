var express = require('express');
var app = express();
// Template Engine
app.set('view engine', 'ejs');
app.use('/assets',express.static('assets'));
var control = require('./controllers/control');
// app.use(express.static('./'));
control.loginPage(app, __dirname);
control.folioPage(app);
control.detailsPage(app);
app.listen(3000);
