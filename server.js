'use strict';

var express = require('express');
var stormpath = require('express-stormpath');
var winston = require('winston');
var expressWinston = require('express-winston');

var routes = require('./lib/routes');

/**
 * Create the Express application.
 */
var app = express();

/**
 * Application settings.
 */
app.set('trust proxy',true);
app.set('view engine', 'jade');
app.set('views', './lib/views');
app.locals.siteName = 'Greenfox Express Project';

/**
 * Logger initialization.
 */

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true,
    }),
  ],
  meta: true,
  expressFormat: true,
  colorStatus: true,
}));

/**
 * Stormpath initialization.
 */

console.log('Initializing Stormpath');

app.use(stormpath.init(app, {
  expand: {
    customData: true
  }
}));

/**
 * Route initialization.
 */
app.use('/', routes);

app.on('stormpath.ready',function () {
  console.log('Stormpath Ready');
});

/**
 * Start the web server.
 */
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Server listening on http://localhost:' + port);
});

