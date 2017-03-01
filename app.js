const http = require('http');
const server = http.createServer();
const fs = require('fs');
const socketio = require('socket.io');

const port = 3000;

server.on('request', function(req, res) {
  fs.readFile('./client/index.html', 'utf8', function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/plane'})
      res.write('page not found!');
      return res.end();
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

server.listen(port, function() {
  console.log('server running on port', port);
})



const io = socketio.listen(server);
io.sockets.on('connection', function(socket) {
  socket.on('message', function(data) {
    var loginMessage = data.value + "ID :" + socket.id;
    console.log(loginMessage);
    io.sockets.emit('from_server', {value: loginMessage});
  });
  socket.on('comment', function(data) {
    var commentMessage = "ID :" + socket.id + ":" + data.value;
    console.log(commentMessage);
    socket.broadcast.emit('from_server', {value: commentMessage});
  });
});
