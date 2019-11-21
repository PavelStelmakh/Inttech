import io from 'socket.io-client';

const socket = io.connect('http://localhost:8000');
const messages = document.querySelector('.messages');
const { form } = document.forms;

socket.on('connect', () => {
    console.info('NoName joined');
    socket.emit('join', 'NoName joined');
});
socket.on('broad', message => {
    console.info(`broad: ${message}`);
    const div = document.createElement('div');
    div.innerHTML = message;
    messages.appendChild(div);
});

const handleSumbit = e => {
    e.preventDefault();
    const { message: { value } } = form.elements;
    console.info(`message: ${value}`);
    socket.emit('message', value);
};

form.addEventListener('submit', handleSumbit);
