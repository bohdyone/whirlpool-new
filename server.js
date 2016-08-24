var express = require('express');
var path = require('path');
var compression = require('compression');
var proces = require('process');
var readline = require('readline');

var app = express();
app.use(compression(), express.static('./dist/'));

var port = 8080;
var server = app.listen(port);

console.log('Listening on port '+port);
