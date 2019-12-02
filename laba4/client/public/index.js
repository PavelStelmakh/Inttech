import io from 'socket.io-client';

const socket = io.connect();
const messages = document.querySelector('.messages');
const { form } = document.forms;

const user = `user_${Math.round(Math.random() * 1000)}`;

socket.on('connect', () => {
    socket.on('join', { name: user, message: `${user} joined` });
});
socket.on('broad', message => {
    const div = document.createElement('div');
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    const span1 = document.createElement('span');
    const span2 = document.createElement('span');
    span1.innerHTML = message.name;
    span2.innerHTML = message.message;
    div1.appendChild(span1);
    div1.appendChild(span2);
    div2.innerHTML = new Date(message.time).toLocaleString();
    div.appendChild(div1);
    div.appendChild(div2);
    messages.appendChild(div);
});

const handleSumbit = e => {
    e.preventDefault();
    const { message } = form.elements;
    socket.on('message', { name: user, message });
};

form.addEventListener('submit', handleSumbit);
