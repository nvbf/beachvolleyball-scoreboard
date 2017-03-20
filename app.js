const util = require('util');
const superagent = require('superagent');

const { parse } = require('url');
const next = require('next');
const express = require('express');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

var io = require('socket.io')(app);

const handle = app.getRequestHandler()

app.prepare().then(() => {
	const server = express();

	server.put('/api/matches/:id', (req, res, next) => {
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

	server.post('/api/matches/', (req, res, next) => {
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

	server.get('/api/matches/:id', (req, res, next) => {
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

	server.get('*', (req, res) => {
		return handle(req, res)
	})

	server.listen(process.env.PORT || 3000, (err) => {
    	if (err) throw err
  	})

	io.on('connection', socket => {
		io.emit('user', 1, {for: 'everyone'});

		socket.on('disconnect', () => {
			io.emit('user', -1, {for: 'everyone'});
		});

		socket.on('match-update', match => {
			io.emit('match-update', match);
		});
	});

});

if (!process.env.API) {
	throw new Error('process.env.API is not defined');
}