const $messagesView = document.getElementById("js-messages-view");
const $listUserChannels = document.getElementById("list-user-channels");
const $buttonCreateChannel = document.getElementById(
  "js-button-create-channel"
);
const $inputChannel = document.getElementById("js-input-channel");

document.querySelector("body").addEventListener("click", function(event) {
  if (event.target.classList.contains("channel")) {
    let activeChannel = event.target.dataset.name;
    let data = parseLocalStorage();
    data.activeChannel = activeChannel; //save active channel
    localStorage.setItem("data", JSON.stringify(data));
    let $allButtonChannels = Array.from(
      document.getElementsByClassName("channel")
    );
    let $allButtonIrcChannels = Array.from(
      document.getElementsByClassName("irc")
    );

    $allButtonChannels.forEach(button => {
      button.classList.remove("-active");
    });

    if (!event.target.classList.contains("irc")) {
      event.target.classList.add("-active");
    } else {
      if (!data.userChannels.includes(event.target.dataset.name)) {
        data.userChannels.push(event.target.dataset.name);
        data.ircMessages[event.target.dataset.name] = { messages: [] };
        localStorage.setItem("data", JSON.stringify(data));
        renderNewChannel(event.target.dataset.name);
        showActiveChannel();
      }
    }

    let messages = getMessageStorage(activeChannel);
    renderMessages(messages);
  }
});

function showActiveChannel() {
  let activeChannel = parseLocalStorage().activeChannel;
  let $currentChannel = $listUserChannels.querySelector(
    `[data-name="${activeChannel}"]`
  );
  $currentChannel.classList.add("-active");
}

function getMessageStorage(nameChannel) {
  let jsonData = parseLocalStorage();
  return jsonData.ircMessages[nameChannel].messages;
}
//inject chat messages from localstorage to html
function renderMessages(messages) {
  $messagesView.innerHTML = "";
  messages.forEach(message => {
    let item = document.createElement("li");
    message.date = new Date(message.date);
    item.classList.add("look-disabled");
    $messagesView.appendChild(item).innerHTML += `[${formatAMPM(
      message.date
    )}]  &lt;@<span class="username">${message.Author}</span>&gt;  ${
      message.text
    }`;
  });
}

function parseLocalStorage() {
  let data = localStorage.getItem("data");
  return JSON.parse(data);
}

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
  let jsonData = parseLocalStorage();

  if (!jsonData.ircChannels.includes(channelName)) {
    updateLocalStorageNewChannel(jsonData, channelName);
    renderNewChannel(channelName);
    showIrcChannels(channelName);
    socket.send(JSON.stringify({ newChannel: channelName }));
  } else {
    alert("This channel already exists");
  }
  $inputChannel.value = "";
  $inputChannel.focus();
}

function renderNewChannel(channelName) {
  let $channel = document.createElement("li");
  $channel.setAttribute("data-name", channelName);
  $channel.classList.add("channel");
  $channel.innerText = channelName;
  $listUserChannels.appendChild($channel);
}

function updateLocalStorageNewChannel(jsonData, channelName) {
  jsonData.ircChannels.push(channelName);
  jsonData.userChannels.push(channelName);
  jsonData.ircMessages[channelName] = { messages: [] };
  localStorage.setItem("data", JSON.stringify(jsonData));
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
  //Ask permision to nofication
  Notification.requestPermission().then(value => {
    localStorage.setItem("notification", value);
  });

  //Getting dom elements and storare data
  let lsData = localStorage.getItem("data");
  let data = parseLocalStorage();
  //Load local storage messages
  if (lsData !== null) {
    let day = null;
    if (!data.ircMessages[data.activeChannel]) {
      updateLocalStorageNewChannel(data, data.activeChannel);
    }
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
      )}]  &lt;@<span class="username">${value.Author}</span>&gt;  ${
        value.text
      }`;
    });
  }
  //move scroll at the end
  lastLine();
  data.userChannels.forEach(element => {
    let channel = document.createElement("li");
    channel.setAttribute("data-name", element);
    channel.classList.add("channel");
    let channelChild = $listUserChannels.appendChild(channel);
    channelChild.innerHTML += element;
  });
  //Load IRC Channles
  showIrcChannels(data);
  showActiveChannel();
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
    )}]  &lt;@<span class="username">${messageData.user}</span>&gt;  ${
      messageData.text
    }`;
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
  } else {
    saveMessages(
      messageData.text,
      data,
      messageData.user,
      messageData.date,
      messageData.current
    );
    //Notication
    if (localStorage.getItem("notification") == "granted") {
      let body = {
        body: `${messageData.user} says: ${messageData.text}`
      };
      new Notification(`${messageData.current}`, body);
    }
    localStorage.setItem("data", JSON.stringify(data));
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

///inject html to irc channel
showIrcChannels = data => {
  let $ircChannels = document.getElementById("irc-channels");

  if (typeof data == "object") {
    $ircChannels.innerHTML = "";

    data.ircChannels.forEach(element => {
      let $channel = document.createElement("li");
      $channel.setAttribute("data-name", element);
      $channel.classList.add("channel", "irc");
      let $channelChild = $ircChannels.appendChild($channel);
      $channelChild.innerHTML += element;
    });
  } else {
    let $channel = document.createElement("li");
    $channel.setAttribute("data-name", data);
    $channel.classList.add("channel", "irc");
    let $channelChild = $ircChannels.appendChild($channel);
    $channelChild.innerHTML = data;
  }
};
