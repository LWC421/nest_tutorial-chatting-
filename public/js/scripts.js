//io안에 인자로 namespace를 지정할 수 있다
const socket = io('/chattings');

const getElementById = (id) => document.getElementById(id) || null;

// DOM Select
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

// draw
const drawHandler = (username) => {
  helloStrangerElement.innerHTML = `Hello ${username}`;
};

// on을 통해 emit를 받기
socket.on('user_connected', (username) => {
  console.log(username, 'connected');
});

function helloUser() {
  const username = prompt('당신의 이름은');
  socket.emit('new_user', username, (data) => {
    drawHandler(data);
  }); //3번째 Callback은 return의 값이 들어온다
}

function init() {
  helloUser();
}

init();
