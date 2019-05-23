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

function handleCreation() {
  event.preventDefault();
  createChannel($inputChannel.value);
}

function createChannel(channelName) {
  let data = localStorage.getItem("data");
  let jsonData = JSON.parse(data);

  if (!jsonData.ircChannels.includes(channelName)) {
    jsonData.ircChannels.push(channelName);
    jsonData.userChannels.push(channelName);
    jsonData.ircMessages[channelName] = { messages: [] };
    localStorage.setItem("data", JSON.stringify(jsonData));

    let $userChannels = document.getElementById("user_channels");
    let $channel = document.createElement("li");
    let $channelChild = $userChannels.appendChild($channel);
    $channelChild.innerHTML = channelName;
    pushingIrcChannels(channelName);
  } else {
    alert("Ya existe");
  }
  // joinChannel(channelName);
}

//Socket Chat
pushingData = (text, obj, user, date) => {
  obj.ircMessages.general.messages.push({
    text,
    date,
    Author: user
  });
};

let btn = document.getElementById("js-add-user-message");
let chat = document.getElementById("js-messages-view");
socket.addEventListener("open", () => {
  let lsData = localStorage.getItem("data");
  let data = JSON.parse(lsData);
  let userChannels = document.getElementById("user_channels");

  if (typeof lsData !== "object") {
    data.ircMessages.general.messages.map(value => {
      value.date = new Date(value.date); //become string to date
      let item = document.createElement("li");
      chat.appendChild(item).innerHTML += `[${formatAMPM(
        value.date
      )}]  &lt;<span class="li-identify">@</span><span class="username">${
        value.Author
      }</span>&gt;  ${value.text}`;
    });
  }
  //move scroll at the end
  document.getElementById(
    "js-messages-list"
  ).scrollTop = document.getElementById("js-messages-list").scrollHeight;

  data.userChannels.forEach(element => {
    let channel = document.createElement("li");
    let channelChild = userChannels.appendChild(channel);
    channelChild.innerHTML += element;
  });

  pushingIrcChannels(data);
});

socket.addEventListener("message", event => {
  let item = document.createElement("li");
  let date = new Date();
  let messageData = JSON.parse(event.data);
  chat.appendChild(item).innerHTML += `[${formatAMPM(
    date
  )}]  &lt;<span class="li-identify">@</span><span class="username">${
    messageData.user
  }</span>&gt;  ${messageData.text}`;

  //move scroll at the end
  document.getElementById(
    "js-messages-list"
  ).scrollTop = document.getElementById("js-messages-list").scrollHeight;
  let lsData = localStorage.getItem("data");
  let data = JSON.parse(lsData);
  pushingData(messageData.text, data, messageData.user, messageData.date);
  localStorage.setItem("data", JSON.stringify(data));
  //Adding user channels
});

btn.addEventListener("click", () => {
  event.preventDefault();
  let $inputUser = document.getElementById("js-input-user-message");
  let local_storage = localStorage.getItem("data");
  let data = JSON.parse(local_storage);
  let date = new Date();
  socket.send(
    JSON.stringify({
      text: $inputUser.value,
      user: data.user,
      date: date
    })
  );

  //move scroll at the end
  document.getElementById(
    "js-messages-list"
  ).scrollTop = document.getElementById("js-messages-list").scrollHeight;

  $inputUser.value = "";
  $inputUser.focus();
});

pushingIrcChannels = data => {
  let $ircChannels = document.getElementById("irc-channels");

  if (typeof data == "object") {
    data.ircChannels.forEach(element => {
      let $channel = document.createElement("li");
      let $channelChild = $ircChannels.appendChild($channel);
      $channelChild.innerHTML += element;
    });
  } else {
    let $channel = document.createElement("li");
    let $channelChild = $ircChannels.appendChild($channel);
    $channelChild.innerHTML = data;
  }
};
