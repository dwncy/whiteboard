const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

// const data = [];

app.use(express.static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  // data.forEach((msg) => {
  //   io.emit('drawing', msg);
  // });

  socket.on('drawing', function(msg){
    // data.push(msg);
    socket.broadcast.emit('drawing', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
