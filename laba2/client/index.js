import io from 'socket.io-client';

const socket = io.connect();
const messages = document.querySelector('.messages');
const { form } = document.forms;

socket.on('connect', () => {
    socket.on('join', 'NoName joined');
});
socket.on('broad', message => {
    const div = document.createElement('div');
    div.innerHTML = message;
    messages.appendChild(div);
});

const handleSumbit = e => {
    e.preventDefault();
    const { message } = form.elements;
    socket.on('message', message);
};

form.addEventListener('submit', handleSumbit);
