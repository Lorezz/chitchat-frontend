import io from 'socket.io-client';

const HOST = process.env.NEXT_PUBLIC_API_HOST;
let socket;
let uploadSocket;

export const initiateSocket = (room, user, token) => {
  socket = io(HOST, { query: { token } });

  if (socket && room) {
    socket.emit('join', { room, user });
  }
  socket.on('connect', () => {
    console.info('connected!');
  });
  socket.on('error', (error) => {
    console.info('error!', error);
  });

  // socket.on('reconnect', (attempts) => {
  //   console.info('reconnect!', attempts);
  // });
  // socket.on('reconnect_error', (error) => {
  //   console.info('reconnect_error!', error);
  // });
  // socket.on('reconnect_failed', (error) => {
  //   console.info('reconnect_failed!', error);
  // });
  // socket.on('connect_timeout', () => {
  //   console.info('connect_timeout!');
  // });

  return socket;
};

export const subscribeToChat = (cb) => {
  if (!socket) return true;

  socket.on('message', (msg) => {
    // console.log('message received!');
    return cb(null, msg);
  });

  socket.on('disconnect', (reason) => {
    console.info('disconnected!', reason);
    return cb('disconnected');
  });

  socket.on('newRoom', (newRoom) => {
    // console.info('newRoom!', newRoom);
    return cb(null, null, newRoom);
  });

  socket.on('newPlayer', (newPlayer) => {
    // console.info('newPlayer!', newPlayer);
    return cb(null, null, null, newPlayer);
  });

  return socket;
};

export const switchRooms = (prevRoom, nextRoom) => {
  if (socket) socket.emit('switch', { prevRoom, nextRoom });
};

export const disconnectSocket = () => {
  console.log('disconnecting socket...');
  if (socket) socket.disconnect();
};

export const sendMessage = (room, message) => {
  if (socket) socket.emit('message', { message, room });
};

export const loadInitialChat = (cb) => {
  if (!socket) return true;
  socket.on('joinResponse', (data) => cb(null, data));
  return socket;
};

export const notifyNewRoom = (newRoom) => {
  if (socket) socket.emit('addRoom', newRoom);
};

export const initUploadSocket = (token, callback) => {
  uploadSocket = io(`${HOST}/upload`, { query: { token } });

  uploadSocket.on('connect', () => {
    console.info('uploadSocket connected!');
  });

  uploadSocket.on('error', (error) => {
    console.info('uploadSocket error!', error);
    callback(error);
  });

  souploadSocketcket.on('uploadProgress', (data) => {
    console.log('uploadProgress', data);
    callback(null, data);
  });
};
