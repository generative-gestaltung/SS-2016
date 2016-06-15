// restify + socket.io
var restify = require('restify'),
    socketio = require('socket.io'),
    server = restify.createServer(),
    io = socketio.listen(server.server),
	uuid = require('node-uuid');


// for retrieving full responses
server.use(restify.fullResponse())
// enable cross origin access
/*
server.use(restify.CORS({
    origins: ['http://localhost:8000'],// defaults to ['*']
    credentials: true,                 // defaults to false
    headers: ['Authorization']         // sets expose-headers
}));
*/

// RESTify routes
server.get('/live', restify.serveStatic({
  directory: './public/',
  file: 'index.html'
}));

server.get('/stats', restify.serveStatic({
  directory: './public/',
  file: 'stats.html'
}));

server.get('/render.js', restify.serveStatic({
  directory: './public/',
  file: 'render.js'
}));

var phoneData = {};


io.on('connection', function (socket) {

  socket.on('register_live', function (data) {
  	console.log("LIVE"); 

	const userid = uuid.v1();
    phoneData[userid] = {};
    
    socket.on('update', function (data) {
      phoneData[userid] = data;
      io.emit('stats', phoneData);
	  //console.log("stats");
    });

    socket.on('disconnect', function (payload) {
      delete phoneData[userid];
      io.emit('stats', phoneData);
    });
  });

  socket.on('register_stats', function (data) {
    console.log("stats reg");
    io.emit('stats', phoneData);
  });
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
  console.log("########################");
});
