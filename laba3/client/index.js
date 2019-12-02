import io from 'socket.io-client';

const socket = io.connect('http://localhost:8000');
const messages = document.querySelector('.messages');
const { form } = document.forms;

const user = `user_${Math.round(Math.random() * 1000)}`;

socket.on('connect', () => {
    console.info('connect');
    socket.emit('join', { name: user, message: `${user} joined` });
});
socket.on('broad', message => {
    console.info('broad data: ', message);
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
    const { message: { value } } = form.elements;    
    console.info(`send message: ${value}`);
    socket.emit('message', { name: user, message: value });
};

form.addEventListener('submit', handleSumbit);
