const express = require('express');
const http = require('http');
const io = require('socket.io');

const app = express();
const server = http.createServer(app);
const socket = io(server);
const PORT = 8000;

socket.on('connection', client => {
    const handleMessageBroad = data => {
        client.broadcast.emit('broad', data);
    };
    client.on('join', handleMessageBroad);
    client.on('message', handleMessageBroad);
});

server.listen(PORT, () => console.log(`server listening on ${PORT} port`))
