const express = require('express');
const http = require('http');
const mongoose = require("mongoose");
const io = require('socket.io');

const app = express();
const server = http.createServer(app);
const socket = io(server);
const PORT = 8000;
const messageScheme = new mongoose.Schema({ name: String, message: String, time: Number, isSend: {
    type: Boolean,
    default: false,
} }, { versionKey: false });
const Message = mongoose.model("Message", messageScheme);

socket.on('connection', client => {
    console.info('connection client');
    const handleMessageBroad = data => {
        console.info('message client: ', data);
        const mess = new Message({ ...data, time: Date.now() });
        mess.save();
    };
    client.on('join', handleMessageBroad);
    client.on('message', handleMessageBroad);

    setInterval(() => {
        Message.findOne({ isSend: false }, (_, message) => {
            if (!message) return;
            client.emit('broad', message);
            client.broadcast.emit('broad', message);
            message.isSend = true;
            message.save();
        });
    }, 1000);
});

mongoose.connect("mongodb://localhost:27017/messagedb", { useNewUrlParser: true }, err => {
    if (err) return console.log(err);
    server.listen(PORT, () => console.log(`server listening on ${PORT} port`));
});
