const util = require('util');
const superagent = require('superagent');

const { parse } = require('url');
const next = require('next');
const express = require('express');

<<<<<<< HEAD
// if (!process.env.API) {
//   throw new Error('process.env.API is not defined');
// }

// io.on('connection', function(socket) {
//   io.emit('user', 1, {for: 'everyone'});
//
//   socket.on('disconnect', function() {
//     io.emit('user', -1, {for: 'everyone'});
//   });
//
//   socket.on('match-update', function(match) {
//     io.emit('match-update', match);
//   });
// });
=======
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })


const handle = app.getRequestHandler()

app.prepare().then(() => {
	const server = express();
	var http = require('http').Server(server);
	var io = require('socket.io')(http);	
	
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
>>>>>>> master

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

<<<<<<< HEAD
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/match.html');
});

// app.put('/api/matches/:id', function(req, res, next) {
//   var apiUrl = process.env.API + req.params.id;
//   logger.debug(req.body);
//   superagent
//     .put(apiUrl)
//     .send(req.body)
//     .set('Accept', 'application/json')
//     .set('Content-Type', 'application/json')
//     .end(function(err, result) {
//       if (err) {
//         console.log('err', err);
//         res.status(500).send(err);
//         res.end();
//       } else if (!result.ok) {
//         res.status(500).send(result.text);
//         res.end();
//       } else {
//         logger.debug(util.inspect('text: ' + result.text));
//         res.end(result.text);
//       }
//     });
// });
//
// app.post('/api/matches/', function(req, res, next) {
//   var apiUrl = process.env.API;
//   logger.debug(req.body);
//   superagent
//     .post(apiUrl)
//     .send(req.body)
//     .set('Accept', 'application/json')
//     .set('Content-Type', 'application/json')
//     .end(function(err, result) {
//       if (err) {
//         console.log('err', err);
//         res.status(500).send(err);
//         res.end();
//       } else if (!result.ok) {
//         res.status(500).send(result.text);
//         res.end();
//       } else {
//         logger.debug(util.inspect('text: ' + result.text));
//         res.end(result.text);
//       }
//     });
// });
//
// app.get('/api/matches/:id', function(req, res, next) {
//   const apiUrl = process.env.API + req.params.id;
//   superagent
//     .get(apiUrl)
//     .set('Accept', 'application/json')
//     .end(function(err, result) {
//       if (err) {
//         console.log('err', err);
//         res.status(500).send(err);
//         res.end();
//       } else if (!result.ok) {
//         res.status(500).send(result.text);
//         res.end();
//       } else {
//         logger.debug(util.inspect('text: ' + result.text));
//         res.end(result.text);
//       }
//     });
// });
=======
	server.get('*', (req, res) => {
		return handle(req, res)
	})

	http.listen(process.env.PORT || 3000, (err) => {
    	if (err) throw err
  	})

	io.on('connection', socket => {
		io.emit('user', 1, {for: 'everyone'});
>>>>>>> master

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