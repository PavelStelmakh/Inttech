const uuid = require('uuid/v4');

const CLIENT_ID = 'app.laba';
const BROKERS = ['localhost:9092'];
const GROUPE_ID = uuid();
const TOPIC = 'message';
const PORT = 8000;

module.exports = {
    CLIENT_ID,
    BROKERS,
    GROUPE_ID,
    TOPIC,
    PORT,
};
