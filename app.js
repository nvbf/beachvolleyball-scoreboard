var express = require('express'),
  app = express(),
  server;

app.use(express.static(__dirname + '/public'));

server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d', server.address().port);
});
