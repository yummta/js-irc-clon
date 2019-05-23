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
    pushingIrcChannels(channelName, "uno");
  } else {
    alert("Ya existe");
  }
  // joinChannel(channelName);
}

// function joinChannel(channelName) {
//   if (!userChannels.includes(channelName)) {
//     userChannels.push(channelName);
//     return userChannels;
//   }
// }

// function changeActiveChannel(channelName) {
//   const channelExists = userChannels.includes(channelName);
//   if (channelExists) {
//     return (activeChannel = channels[channelName]);
//   }
// }

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
  let local_storage = localStorage.getItem("data");
  let data = JSON.parse(local_storage);
  let userChannels = document.getElementById("user_channels");

  if (typeof local_storage !== "object") {
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

  data.userChannels.forEach(element => {
    let channel = document.createElement("li");
    let channelChild = userChannels.appendChild(channel);
    channelChild.innerHTML += element;
  });

  pushingIrcChannels(data, "muchos");
});

socket.addEventListener("message", event => {
  let item = document.createElement("li");
  let date = new Date();
  let message_data = JSON.parse(event.data);
  chat.appendChild(item).innerHTML += `[${formatAMPM(
    date
  )}]  &lt;<span class="li-identify">@</span><span class="username">${
    message_data.user
  }</span>&gt;  ${message_data.text}`;
  let local_storage = localStorage.getItem("data");
  let data = JSON.parse(local_storage);
  pushingData(message_data.text, data, message_data.user, message_data.date);
  localStorage.setItem("data", JSON.stringify(data));
  //Adding user channels
});

btn.addEventListener("click", () => {
  event.preventDefault();
  let text = document.getElementById("js-input-user-message");
  let local_storage = localStorage.getItem("data");
  let data = JSON.parse(local_storage);
  let date = new Date();
  socket.send(
    JSON.stringify({
      text: text.value,
      user: data.user,
      date: date
    })
  );
  text.value = "";
  text.focus();
});

pushingIrcChannels = (data, cantidad) => {
  let $ircChannels = document.getElementById("irc-channels");

  if (cantidad == "muchos") {
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
