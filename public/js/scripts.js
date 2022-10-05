//io안에 인자로 namespace를 지정할 수 있다
const socket = io('/chattings');

const getElementById = (id) => document.getElementById(id) || null;

const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

function helloUser() {
  const username = prompt('당신의 이름은');
  socket.emit('new_user', username, (data) => {
    console.log(data);
  }); //3번째 Callback은 return의 값이 들어온다

  socket.on('hello_user', (data) => {
    console.log(data);
  });
}

function init() {
  helloUser();
}

init();
