// localStorage.setItem("userChannels", JSON.stringify(["english", "varios", "forobardo"]))
function renderUserChanels() {
  if (localStorage.getItem("userChannels")) {
    const userChannels = localStorage.getItem("userChannels");
    const arrUserChannels = JSON.parse(userChannels);
    let htmlUserChannels = "";
    arrUserChannels.forEach(channelName => {
      htmlUserChannels += `<li>${channelName}</li>`;
    });
    $listUserChannels.innerHTML = htmlUserChannels;
  }
}

renderUserChanels();

const $buttonCreateChannel = document.getElementById(
  "js-button-create-channel"
);
const $inputChannel = document.getElementById("js-input-channel");

$buttonCreateChannel.addEventListener("click", handleCreation);

let channels = { general: { name: "general" } };
let userChannels = ["general"];
let activeChannel = channels["general"];

function handleCreation() {
  event.preventDefault();
  const storeChannelCreated = createChannel($inputChannel.value);
  if (storeChannelCreated) {
    localStorage.setItem("channels", JSON.stringify(storeChannelCreated));
  }
}

function createChannel(channelName) {
  const channelCreated = { channelName: { name: channelName } };
  const channelExists = channels.hasOwnProperty(channelName);
  if (!channelExists) {
    channels[channelName] = channelCreated.channelName;
    joinChannel(channelName);
    changeActiveChannel(channelName);
    return channels;
  }
}

function joinChannel(channelName) {
  if (!userChannels.includes(channelName)) {
    userChannels.push(channelName);
    return userChannels;
  }
}

function changeActiveChannel(channelName) {
  const channelExists = userChannels.includes(channelName);
  if (channelExists) {
    return (activeChannel = channels[channelName]);
  }
}

//Socket Chat
pushingData = (text, obj, user, date) => {
  obj.message.general.messages.push({
    text,
    date,
    Author: user
  });
};

let btn = document.getElementById("btn");
let chat = document.getElementById("chat");

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
  let message_data = JSON.parse(event.data);
  chat.appendChild(item).innerHTML += ` ${message_data.user} : ${
    message_data.text
  } - ${date}`;
  let local_storage = localStorage.getItem("data");
  let data = JSON.parse(local_storage);
  pushingData(message_data.text, data, message_data.user, message_data.date);
  localStorage.setItem("data", JSON.stringify(data));
});

btn.addEventListener("click", () => {
  let text = document.getElementById("text").value;
  let local_storage = localStorage.getItem("data");
  let data = JSON.parse(local_storage);
  let date = new Date();
  socket.send(
    JSON.stringify({
      text,
      user: data.user,
      date
    })
  );
});
