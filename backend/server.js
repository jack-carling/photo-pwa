const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());

let connections = [];

app.get('/api/chat', (req, res) => {
  let connection = { req, res };
  connections.push(connection);

  req.on('close', () => {
    connections = connections.filter((x) => x !== connection);
  });

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });

  /* Avoid Vite http proxy error */
  const message = JSON.stringify({ initial: true });
  res.write('data: ' + message + ' \n\n');
});

app.post('/api/chat/message', (req, res) => {
  let message = req.body;
  message.time = Date.now();
  emitMessage(message);
  res.json({ success: true });
});

function emitMessage(message) {
  for (let { res } of connections) {
    res.write('data: ' + JSON.stringify(message) + '\n\n');
  }
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
