const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {origin : '*'}
});

const port = process.env.PORT || 3000;

//it can receive a message and disconect emitted by the app
//when we receive a message server emits an event oout to all users connected to this socket
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});

io.on('connection', function (socket) {
  socket.on('data', function (data) {                     // listen on client emit 'data'
    var ret = Object.assign({}, data, {
      frame: Buffer.from(data.frame, 'base64').toString() // from buffer to base64 string
    })
    io.emit('data', ret);                                 // emmit to socket
  })
})

httpServer.listen(port, () => console.log(`listening on port ${port}`));