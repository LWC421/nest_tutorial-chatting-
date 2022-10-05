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

const drawNewChat = (message) => {
  const wrapperChatBox = document.createElement('div');
  const chatBox = `
    <div>
      ${message}
    </div>
  `;

  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

// on을 통해 emit를 받기
socket.on('user_connected', (username) => {
  drawNewChat(`${username} connected`);
});
socket.on('new_chat', (data) => {
  const { chat, username } = data;
  drawNewChat(`${username} : ${chat}`);
});

// event handler
const handleSubmit = (event) => {
  event.preventDefault();

  //input값 가져오기
  const inputValue = event.target.elements[0].value;
  //보내기
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);
    drawNewChat(`me : ${inputValue}`);
    event.target.elements[0].value = '';
  }
};

function helloUser() {
  const username = prompt('당신의 이름은');
  socket.emit('new_user', username, (data) => {
    drawHandler(`Hello ${data}`);
  });
}

function init() {
  helloUser();
  //이벤트 연결
  formElement.addEventListener('submit', handleSubmit);
}

init();
