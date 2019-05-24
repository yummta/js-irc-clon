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
  if (!$inputChannel.value.trim()) {
    alert("Ingrese nombre de channel");
  } else {
    createChannel($inputChannel.value);
  }
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
    socket.send(JSON.stringify({ newChannel: channelName }));
  } else {
    alert("Ya existe");
  }
  $inputChannel.value = "";
  $inputChannel.focus();
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
let chat = document.getElementById("messages");

//LOAD ALL USER DATA IN LOCAL STORAGE
socket.addEventListener("open", () => {
  //Getting dom elements and storare data
  let lsData = localStorage.getItem("data");
  let data = JSON.parse(lsData);
  let userChannels = document.getElementById("user_channels");

  //Load local storage messages
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
<<<<<<< HEAD
  //move scroll at the end
  lastLine();
=======
>>>>>>> 9ed05d5d3bd882fab08ea2faea0763b78733d5f7

  //Load user channels
  data.userChannels.forEach(element => {
    let channel = document.createElement("li");
    let channelChild = userChannels.appendChild(channel);
    channelChild.innerHTML += element;
  });
  //Load IRC Channles
  pushingIrcChannels(data);
});

//DO SOMETHING WHEN SOMEONE SEND SOMETHING TO THE SOCKET
socket.addEventListener("message", event => {
  let messageData = JSON.parse(event.data);

  if (messageData.newChannel) {
    let lsData = localStorage.getItem("data");
    let data = JSON.parse(lsData);
    let a = data.ircChannels;
    a.push(messageData.newChannel);
    data.ircChannels = [...new Set(a)];
    localStorage.setItem("data", JSON.stringify(data));
    pushingIrcChannels(data);
  } else {
    let item = document.createElement("li");
    let date = new Date();
    chat.appendChild(item).innerHTML += `[${formatAMPM(
      date
    )}]  &lt;<span class="li-identify">@</span><span class="username">${
      messageData.user
    }</span>&gt;  ${messageData.text}`;
    let lsData = localStorage.getItem("data");
    let data = JSON.parse(lsData);
    pushingData(messageData.text, data, messageData.user, messageData.date);
    //Adding user channels
<<<<<<< HEAD
=======
    console.log(event);
>>>>>>> 9ed05d5d3bd882fab08ea2faea0763b78733d5f7
    let a = data.ircChannels;
    let b = a.concat(messageData.ircChannels);
    data.ircChannels = [...new Set(b)];
    localStorage.setItem("data", JSON.stringify(data));
    pushingIrcChannels(data);
  }
});

//ACTION DO THE BUTTON OF CHAT
btn.addEventListener("click", () => {
  event.preventDefault();
<<<<<<< HEAD
  let $inputUser = document.getElementById("js-input-user-message");
=======
  let text = document.getElementById("js-input-user-message");
>>>>>>> 9ed05d5d3bd882fab08ea2faea0763b78733d5f7
  let lsData = localStorage.getItem("data");
  let data = JSON.parse(lsData);
  let date = new Date();
  socket.send(
    JSON.stringify({
      text: $inputUser.value,
      user: data.user,
      date: date,
      ircChannels: data.ircChannels
    })
  );
  //move scroll at the end
  lastLine();
  $inputUser.value = "";
  $inputUser.focus();
});

pushingIrcChannels = data => {
  let $ircChannels = document.getElementById("irc-channels");
<<<<<<< HEAD
=======

>>>>>>> 9ed05d5d3bd882fab08ea2faea0763b78733d5f7
  if (typeof data == "object") {
    while ($ircChannels.firstChild) {
      $ircChannels.removeChild($ircChannels.firstChild);
    }

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
