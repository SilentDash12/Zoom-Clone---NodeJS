const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
}) // we have imported a peer Js and we have ask ExpressPeerServer to connect
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);
app.get('/', (req, res) => { // This ig oing to be a room, this is a paramter
  res.redirect(`/${uuidv4()}`);

  // So this will automatically generate a uuid (a number) for your room when you create a new room
  // the upload get will get the uuid function that generated it, and we are going to pass the const to the front
})

// So the uuid that has been generated redirects me to the room call roomId

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room }) // This says what view files that we're going to render
})




io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId);
    socket.on('message', message => {
      io.to(roomId).emit('createMessage', message)
    })
  })
})
server.listen(process.env.PORT||3030);
