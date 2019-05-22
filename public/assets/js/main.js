const socket = new WebSocket("ws://192.168.86.115:1234");
//const socket = new WebSocket("ws://localhost:1234");
let obj = {
  user: "Carlos",
  channel: ["general", "codeable"],
  message: {
    general: {
      name: "general",
      messages: [
        {
          text: "prueba",
          date: "03/30/2193",
          author: "Carlos"
        },
        {
          text: "prueba 2",
          date: "03/30/2193",
          author: "Daniel"
        }
      ]
    }
  }
};

let chat = document.getElementById("chat");
let btn = document.getElementById("btn");
let $data = document.getElementById("data");

socket.addEventListener("message", event => {
  let messages = localStorage.getItem("data");
  let data = JSON.parse(messages);
  let item = document.createElement("li");

  data.message.general.messages.forEach(element => {
    $data.appendChild(item).innerHTML += `LS: ${element.text} <br> ${
      element.date
    } <br> ${element.author}`;
  });

  chat.appendChild(item).innerHTML += "YOU :" + event.data;
});

btn.addEventListener("click", () => {
  let text = document.getElementById("text").value;
  socket.send(text);

  obj.message.general.messages.push({
    text: text,
    date: new Date(),
    author: "Carlos"
  });

  if (typeof localStorage.getItem("data") == "object") {
    localStorage.setItem("data", JSON.stringify(obj));
  } else {
    let messages = localStorage.getItem("data");
    let data = JSON.parse(messages);
    data.message.general.messages.push({
      text: text,
      date: new Date(),
      author: "Carlos"
    });
    localStorage.setItem("data", JSON.stringify(data));
  }
});

// socket.close(1000, "Not required anymore");
