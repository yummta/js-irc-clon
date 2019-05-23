let socket = new WebSocket("ws://192.168.86.115:1234");
//const socket = new WebSocket("ws://localhost:1234");
socket.addEventListener("open", function(event) {
  console.log("Connected to server");
});

socket.addEventListener("close", () => {
  alert("Connection closed");
});

pushingData = (text, obj, user) => {
  obj.message.general.messages.push({
    text,
    date: new Date(),
    Author: user
  });
};

getUser = obj => {
  return obj.user;
};

let chat = document.getElementById("chat");
let btn = document.getElementById("btn");

socket.addEventListener("message", event => {
  let item = document.createElement("li");
  chat.appendChild(item).innerHTML += "YOU :" + event.data + "<br>";
});

btn.addEventListener("click", () => {
  let text = document.getElementById("text").value;
  let user = document.getElementById("user").value;
  let local_storage = localStorage.getItem("data");
  socket.send(text);

  let obj = {
    user: user,
    channel: ["general", "codeable"],
    message: {
      general: {
        messages: [
          {
            text,
            date: new Date(),
            Author: user
          }
        ]
      }
    }
  };

  if (typeof local_storage == "object") {
    localStorage.setItem("data", JSON.stringify(obj));
  } else {
    let data = JSON.parse(local_storage);
    pushingData(text, data, user);
    localStorage.setItem("data", JSON.stringify(data));
  }
});

// socket.close(1000, "Not required anymore");
