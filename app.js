const express = require('express');
const app = express();
const superagent = require('superagent');
const bodyParser = require('body-parser');
const logger = require('winston');
const util = require('util');
var http = require('http').Server(app);
var io = require('socket.io')(http);


if (!process.env.API) {
  throw new Error('process.env.API is not defined');
}

io.on('connection', function(socket) {
  io.emit('user', 1, {for: 'everyone'});

  socket.on('disconnect', function() {
    io.emit('user', -1, {for: 'everyone'});
  });

  socket.on('match-update', function(match) {
    io.emit('match-update', match);
  });
});


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json

app.put('/api/matches/:id', function(req, res, next) {
  var apiUrl = process.env.API + req.params.id;
  logger.debug(req.body);
  superagent
    .put(apiUrl)
    .send(req.body)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .end(function(err, result) {
      if (err) {
        console.log('err', err);
        res.status(500).send(err);
        res.end();
      } else if (!result.ok) {
        res.status(500).send(result.text);
        res.end();
      } else {
        logger.debug(util.inspect('text: ' + result.text));
        res.end(result.text);
      }
    });
});

app.post('/api/matches/', function(req, res, next) {
  var apiUrl = process.env.API;
  logger.debug(req.body);
  superagent
    .post(apiUrl)
    .send(req.body)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .end(function(err, result) {
      if (err) {
        console.log('err', err);
        res.status(500).send(err);
        res.end();
      } else if (!result.ok) {
        res.status(500).send(result.text);
        res.end();
      } else {
        logger.debug(util.inspect('text: ' + result.text));
        res.end(result.text);
      }
    });
});

app.get('/api/matches/:id', function(req, res, next) {
  const apiUrl = process.env.API + req.params.id;
  superagent
    .get(apiUrl)
    .set('Accept', 'application/json')
    .end(function(err, result) {
      if (err) {
        console.log('err', err);
        res.status(500).send(err);
        res.end();
      } else if (!result.ok) {
        res.status(500).send(result.text);
        res.end();
      } else {
        logger.debug(util.inspect('text: ' + result.text));
        res.end(result.text);
      }
    });
});


var server = http.listen(process.env.PORT || 3000, function() {
  logger.info('Listening on port %d', server.address().port);
});
