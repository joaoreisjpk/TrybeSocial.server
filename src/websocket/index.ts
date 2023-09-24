import { io } from '../http';
import getMessages from './getMessages';
import sendMessage from './sendMessage';

let roomUsers = {} as any;

io.on('connection', (socket) => {
  io.emit('users_response', roomUsers);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    roomUsers = {
      ...roomUsers,
      [roomId]: [...(roomUsers[roomId] ?? []), socket.id],
    };
    io.emit('users_response', roomUsers);
  });

  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });

  socket.on('sendMessage', (data) => sendMessage(data, io));

  socket.on('getMessages', (data) => getMessages(data, io));

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing_response', data);
  });

  socket.on('disconnect', () => {
    for (const [roomId, users] of Object.entries(roomUsers)) {
      if (users.includes(socket.id)) {
        roomUsers[roomId] = [...users.filter((id) => id !== socket.id)];
        io.emit('receive_message', {
          text: 'A user left the room.',
          socketId: 'kurakani',
          roomId,
        });
      }
    }
    io.emit('users_response', roomUsers);
  });
});
