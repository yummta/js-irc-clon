//const socket = new WebSocket("ws://localhost:1234");
pushingData = (text, obj, user) => {
  obj.message.general.messages.push({
    text,
    date: new Date(),
    Author: user
  });
};

let chat = document.getElementById("chat");
let btn = document.getElementById("btn");

socket.addEventListener("open", () => {
  let local_storage = localStorage.getItem("data");
  let data = JSON.parse(local_storage);

  if (typeof local_storage !== "object") {
    data.message.general.messages.map(value => {
      let item = document.createElement("li");
      chat.appendChild(item).innerHTML += ` ${value.Author} : ${value.text} - ${
        value.date
      }`;
    });
  }
});

socket.addEventListener("message", event => {
  let item = document.createElement("li");
  let date = new Date();
  let user = document.getElementById("user").value;
  chat.appendChild(item).innerHTML += ` ${user} : ${event.data} - ${date}`;
});

btn.addEventListener("click", () => {
  let text = document.getElementById("text").value;
  let user = document.getElementById("user").value;
  let local_storage = localStorage.getItem("data");
  let data = JSON.parse(local_storage);
  socket.send(text);

  if (typeof local_storage == "object") {
    localStorage.setItem("data", JSON.stringify(obj));
  } else {
    pushingData(text, data, user);
    localStorage.setItem("data", JSON.stringify(data));
  }
});

// socket.close(1000, "Not required anymore");

{
  /* <input type="text" name="text" id="text" />
    <input type="text" name="user" id="user" />
    <button id="btn">Enviar</button>
    <div id="chat"></div>
    <script src="assets/js/socket.js"></script> */
}
