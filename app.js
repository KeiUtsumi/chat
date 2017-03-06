const http = require('http');
const server = http.createServer();
const fs = require('fs');
const socketio = require('socket.io');

const port = 3000;

server.on('request', function(req, res) {
  fs.readFile('./client/index.html', 'utf8', function(err, data) {//ここのファイル読ませる
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/plane'})
      res.write('page not found!');//そのURLに読みたいファイル無いぞ
      return res.end();
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

server.listen(port, function() {
  console.log('server running on port', port);
});

var members = [];

const io = socketio.listen(server);
io.sockets.on('connection', function(socket) {
  socket.on('inMessage', function(data) {
    var loginMessage = data.value + " -> [ID : " + socket.id + "]";
    console.log(loginMessage);
    io.sockets.emit('from_server_id', {value: loginMessage});
  });
  socket.on('login', function(data) {
    var commentMessage = " user name : " + data.value + " <font color='#c0c0c0'>[ID : " + socket.id + "]</font> Join!!";
    console.log(commentMessage);
    io.sockets.emit('from_server_login', {value: commentMessage});
    members[socket.id] = data.value;
  });
  socket.on('comment', function(data) {
    var commentMessage = members[socket.id] + " : " + data.value + " <font color='#d0d0d0'>[ID : " + socket.id + "]</font>";
    console.log(commentMessage);
    //socket.broadcast.emit('from_server_comment', {value: commentMessage});
    io.sockets.emit('from_server_comment', {value: commentMessage});
  });
});
