const util = require('util');
const httpLib = require('http');
const superagent = require('superagent');
const bodyParser = require('body-parser');
const logger = require('winston');

const express = require('express');

const app = express();
const http = httpLib.Server(app);
const io = require('socket.io')(http);

if (!process.env.API) {
	throw new Error('process.env.API is not defined');
}

io.on('connection', socket => {
	io.emit('user', 1, {for: 'everyone'});

	socket.on('disconnect', () => {
		io.emit('user', -1, {for: 'everyone'});
	});

	socket.on('match-update', match => {
		io.emit('match-update', match);
	});
});

app.get('/match', (req, res) => {
	res.sendFile(__dirname + '/public/match.html');
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // For parsing application/json

app.put('/api/matches/:id', (req, res, next) => {
	const apiUrl = process.env.API + req.params.id;
	logger.debug(req.body);
	superagent
    .put(apiUrl)
    .send(req.body)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .end((err, result) => {
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

app.post('/api/matches/', (req, res, next) => {
	const apiUrl = process.env.API;
	logger.debug(req.body);
	superagent
    .post(apiUrl)
    .send(req.body)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .end((err, result) => {
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

app.get('/api/matches/:id', (req, res, next) => {
	const apiUrl = process.env.API + req.params.id;
	superagent
    .get(apiUrl)
    .set('Accept', 'application/json')
    .end((err, result) => {
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

var server = http.listen(process.env.PORT || 3000, () => {
	logger.info('Listening on port %d', server.address().port);
});
