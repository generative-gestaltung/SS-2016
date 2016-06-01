// require libraries and create simple http server
var restify = require('restify'),
    socketio = require('socket.io'),
    server = restify.createServer();


// start websoscket connection
var io = socketio.listen(server.server);


// for retrieving full responses
server.use(restify.fullResponse())

// RESTify routes
server.get('/', restify.serveStatic({
  directory: './public/',
  file: 'index.html'
}));


var nConnections = 0;

io.on('connection', function (socket) {
	nConnections += 1;
	console.log("websocket connection started");
	socket.emit("info", nConnections);

	socket.on('disconnect', function(payload) {
		nConnections -= 1;
		io.emit("info", nConnections);	
	});
});


server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
  console.log("########################");
});
