// localStorage.setItem("userChannels", JSON.stringify(["english", "varios", "forobardo"]))
document.body.addEventListener(
  "click",
  function(evt) {
    if (evt.target.className === "joinChannel") {
      console.log(evt.target.textContent);
      let ls = localStorage.getItem("data");
      let data = JSON.parse(ls);
      data.activeChannel = evt.target.textContent;
      localStorage.setItem("data", JSON.stringify(data));
      console.log(data.activeChannel);
    }
  },
  false
);

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
    alert("Please enter a channel's name");
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
    showIrcChannels(channelName);
    socket.send(JSON.stringify({ newChannel: channelName }));
  } else {
    alert("This channel already exists");
  }
  $inputChannel.value = "";
  $inputChannel.focus();
  // joinChannel(channelName);
}

//Socket Chat
saveMessages = (text, obj, user, date, channel) => {
  obj.ircMessages[channel].messages.push({
    text,
    date,
    Author: user
  });
};

const btn = document.getElementById("js-add-user-message");
const chat = document.getElementById("js-messages-view");

//LOAD ALL USER DATA IN LOCAL STORAGE
socket.addEventListener("open", () => {
  //Getting dom elements and storare data
  let lsData = localStorage.getItem("data");
  let data = JSON.parse(lsData);
  let userChannels = document.getElementById("user_channels");

  //Load local storage messages
  if (lsData !== null) {
    let day = null;
    data.ircMessages[data.activeChannel].messages.forEach(value => {
      value.date = new Date(value.date); //become string to date
      let currentDay = value.date.getDate();
      if (currentDay !== day) {
        let separator = document.createElement("span");
        separator.className = "center";
        chat.appendChild(separator).innerHTML = `${formatdate(value.date)}`;
        day = currentDay;
      }
      let item = document.createElement("li");
      item.classList.add("look-disabled");
      chat.appendChild(item).innerHTML += `[${formatAMPM(
        value.date
      )}]  &lt;<span class="li-identify">@</span><span class="username">${
        value.Author
      }</span>&gt;  ${value.text}`;
    });
  }
  //move scroll at the end
  lastLine();
  data.userChannels.forEach(element => {
    let channel = document.createElement("li");
    channel.classList.add("joinChannel");
    let channelChild = userChannels.appendChild(channel);
    channelChild.innerHTML += element;
  });
  //Load IRC Channles
  showIrcChannels(data);
});

//DO SOMETHING WHEN SOMEONE SEND SOMETHING TO THE SOCKET
socket.addEventListener("message", event => {
  let messageData = JSON.parse(event.data);
  let lsData = localStorage.getItem("data");
  let data = JSON.parse(lsData);
  let getIrcChannels = data.ircChannels;

  if (messageData.newChannel) {
    getIrcChannels.push(messageData.newChannel);
    data.ircChannels = [...new Set(getIrcChannels)];
    localStorage.setItem("data", JSON.stringify(data));
    showIrcChannels(data);
  } else if (data.activeChannel == messageData.current) {
    let item = document.createElement("li");
    let date = new Date();
    chat.appendChild(item).innerHTML += `[${formatAMPM(
      date
    )}]  &lt;<span class="li-identify">@</span><span class="username">${
      messageData.user
    }</span>&gt;  ${messageData.text}`;
    lastLine();

    saveMessages(
      messageData.text,
      data,
      messageData.user,
      messageData.date,
      messageData.current
    );
    //Adding user channels
    let newIrcChannels = getIrcChannels.concat(messageData.ircChannels);
    data.ircChannels = [...new Set(newIrcChannels)];
    localStorage.setItem("data", JSON.stringify(data));
    showIrcChannels(data);
  }
});

//ACTION DO THE BUTTON OF CHAT
btn.addEventListener("click", () => {
  event.preventDefault();
  let $inputUser = document.getElementById("js-input-user-message");
  let lsData = localStorage.getItem("data");
  let data = JSON.parse(lsData);
  let date = new Date();
  socket.send(
    JSON.stringify({
      text: $inputUser.value,
      user: data.user,
      date: date,
      ircChannels: data.ircChannels,
      current: data.activeChannel
    })
  );
  //move scroll at the end
  lastLine();
  $inputUser.value = "";
  $inputUser.focus();
});

showIrcChannels = data => {
  let $ircChannels = document.getElementById("irc-channels");

  if (typeof data == "object") {
    $ircChannels.innerHTML = "";

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
