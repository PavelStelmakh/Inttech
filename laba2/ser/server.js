const fs = require('fs');
const express = require('express');
const request = require('request');

const app = express();

let connection = [];

app.use(express.json());
app.use(express.static(__dirname));

app.put('/message', (req, res) => {
    const messages = JSON.parse(fs.readFileSync(__dirname + '/messages.json'));
    messages.push(req.body);
    fs.writeFileSync(__dirname + '/messages.json', JSON.stringify(messages));
    console.log('message', req.body);
    connection.forEach(path => {
        request.put(path);
    });
    setTimeout(() => fs.writeFileSync(__dirname + '/messages.json', JSON.stringify(messages.map(m => ({ ...m, isSend: true })))), 500);
    res.status(200).send();
});

app.put('/connect', (req, res) => {
    const { path } = req.body;
    console.log('connect', path);
    connection.push(path);
    res.status(200).send();
});

app.put('/disconnect', (req, res) => {
    const { path } = req.body;
    console.log('disconnect', path);
    connection = connection.filter(p => p !== path);
    res.status(200).send();
});

app.listen(8000, () => {
    console.log(8000);
});
