const CONFIG = require('./config');
const { Kafka } = require('kafkajs');
const express = require('express');
const http = require('http');
const io = require('socket.io');

const kafka = new Kafka({
    clientId: CONFIG.CLIENT_ID,
    brokers: CONFIG.BROKERS,
});
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: CONFIG.GROUPE_ID });

const app = express();
const server = http.createServer(app);
const socket = io(server);

socket.on('connection', client => {
    console.log('client connection');
    const handleMessageBroad = data => {
        console.log('get message: ', data);
        console.log('send to kafka');
        producer.send({
            topic: CONFIG.TOPIC,
            messages: [
                { value: JSON.stringify({ ...data, time: Date.now() }) },
            ],
        });
    };
    client.on('join', handleMessageBroad);
    client.on('message', handleMessageBroad);
    consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const data = JSON.parse(message.value.toString());
            client.broadcast.emit('broad', data);
            client.emit('broad', data);
        },
    })
});

const kafkaConnect = async () => {
    console.log('init');
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({ topic: 'message', fromBeginning: true });
};

kafkaConnect().then(() => server.listen(CONFIG.PORT, () => console.log(`server listening on ${CONFIG.PORT} port`)));
