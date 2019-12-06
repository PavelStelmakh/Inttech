const { PORT } = process.env;
const fs = require('fs');
const express = require('express');
const request = require('request');

const app = express();
const SERVER = 'http://localhost:8000';
const CLIENT = `http://localhost:${PORT}/message`;
const user = `user_${Math.round(Math.random() * 1000)}`;

app.use(express.json());
app.use(express.static(__dirname));

app.put('/message', (req, res) => {
    const fileStream = fs.createWriteStream(__dirname + '/messages.json');
    request(`${SERVER}/messages.json`)
        .pipe(fileStream)
        .on('finish', () => {
            const messages = JSON.parse(fs.readFileSync(__dirname + '/messages.json'));
            const prints = messages.filter(m => !m.isSend);
            prints.forEach(m => {
                if (user !== m.name) {
                    console.log(m.message);
                }
            });
        });
    res.status(200).send();
});

app.listen(PORT, () => {
    console.log(PORT);
    const body = JSON.stringify({ path: CLIENT });
    request.put(`${SERVER}/connect`,
    {
        body,
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    });
});

process.on('SIGINT', () => {
    const body = JSON.stringify({ path: CLIENT });
    request.put(`${SERVER}/disconnect`,
    {
        body,
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, () => process.exit(0));
});

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    const body = JSON.stringify({ name: user, message: chunk, time: new Date(), isSend: false });
    request.put(`${SERVER}/message`,
    {
        body,
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    });
  }
});
