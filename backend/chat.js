const Message = require('./models/message');

let connections = {};
let rooms = {};

module.exports = (app) => {
  app.get('/api/chat', (req, res) => {
    const id = req.query.id;

    connections[id] = res;

    req.on('close', () => {
      delete connections[id];
    });

    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    });

    /* Avoid Vite http proxy error */
    const message = JSON.stringify({ initial: true });
    res.write('data: ' + message + ' \n\n');
  });

  app.get('/api/chat/join/:room', (req, res) => {
    const id = req.query.id.toLowerCase();
    const type = req.query.type;

    let room = req.params.room;
    room = `${room}-${type}`;

    if (!rooms[room]) rooms[room] = [];

    if (!rooms[room].includes(id)) {
      rooms[room].push(id);
    }

    res.json({ success: true, join: room });
  });

  app.get('/api/chat/leave/:room', (req, res) => {
    const id = req.query.id.toLowerCase();
    const type = req.query.type;

    let room = req.params.room;
    room = `${room}-${type}`;

    if (rooms.hasOwnProperty(room)) {
      rooms[room].splice(rooms[room].indexOf(id), 1);

      // Remove unused clients
      const connectedClients = Object.keys(connections);
      for (let client of Object.values(rooms[room])) {
        if (!connectedClients.includes(client)) {
          rooms[room].splice(rooms[room].indexOf(client), 1);
        }
      }

      // Remove empty room
      if (rooms[room].length < 1) {
        delete rooms[room];
      }
    }

    res.json({ success: true, left: room });
  });

  app.post('/api/chat/message', async (req, res) => {
    let message = req.body;
    message.time = Date.now();

    message = new Message(message);
    await message.save();

    let target;

    /* If broadcasting, check for photo, location or tag to alter the target */
    if (message.chatType !== 'private') {
      target = message.chatTarget + '-' + message.chatType;
    } else {
      target = message.chatTarget;
    }

    if (rooms[target]) {
      broadcastRoom(target, message);
    } else {
      sendSSE(message.chatTarget, message);
      sendSSE(message.user, message);
    }

    res.json({ success: true });
  });
};

// Broadcast to everyone in the same room
function broadcastRoom(room, message) {
  for (let id of rooms[room]) {
    sendSSE(id, message);
  }
}

// Send message to target client
function sendSSE(id, data) {
  connections[id] && connections[id].write('data:' + JSON.stringify(data) + '\n\n');
}
