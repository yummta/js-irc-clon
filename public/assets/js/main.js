const $messagesView = document.getElementById("js-messages-view");
const $listUserChannels = document.getElementById("list-user-channels");
const $buttonCreateChannel = document.getElementById(
  "js-button-create-channel"
);
const $inputChannel = document.getElementById("js-input-channel");
const $deleteLocalStorage = document.getElementById("clear-data");
const $allowNotifications = document.getElementById("allow-notifications");

document.querySelector("body").addEventListener("click", function(event) {
  if (event.target.classList.contains("channel")) {
    let activeChannel = event.target.dataset.name;
    let data = parseLocalStorage();
    data.activeChannel = activeChannel; //save active channel
    localStorage.setItem("data", JSON.stringify(data));
    let $allButtonChannels = Array.from(
      document.getElementsByClassName("channel")
    );

    $allButtonChannels.forEach(button => {
      button.classList.remove("-active");
    });

    if (!event.target.classList.contains("irc")) {
      event.target.classList.add("-active");
    } else {
      let userButtonChannels = $allButtonChannels.filter(button => {
        return button.dataset.name == activeChannel;
      });
      if (userButtonChannels.length > 1) {
        userButtonChannels[1].classList.add("-active");
      }
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
    focusMessagesInput();
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
    item.classList.add("look-disabled", "message");
    let date = `[${formatAMPM(message.date)}]`;
    let user = `<span class="username">@${message.Author}</span>`;
    $messagesView.appendChild(item).innerHTML += `${date} ${user} ${
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
  closeLightBox();
}

function renderNewChannel(channelName) {
  let $channel = document.createElement("li");
  $channel.setAttribute("data-name", channelName);
  $channel.classList.add("channel", "item");
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
  let data = parseLocalStorage();
  if (Object.values(data.userChannels).includes(channel)) {
    obj.ircMessages[channel].messages.push({
      text,
      date,
      Author: user
    });
  }
};

const btn = document.getElementById("js-add-user-message");

//LOAD ALL USER DATA IN LOCAL STORAGE
socket.addEventListener("open", () => {
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
        separator.className = "center separator";
        $messagesView.appendChild(separator).innerHTML = `${formatdate(
          value.date
        )}`;
        day = currentDay;
      }
      let item = document.createElement("li");
      item.classList.add("look-disabled", "message");
      let date = `[${formatAMPM(value.date)}]`;
      let user = `<span class="username">@${value.Author}</span>`;

      $messagesView.appendChild(item).innerHTML += `${date} ${user} ${
        value.text
      }`;
    });
  }
  //move scroll at the end
  lastLine();
  data.userChannels.forEach(element => {
    let channel = document.createElement("li");
    channel.setAttribute("data-name", element);
    channel.classList.add("channel", "item");
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
    let checkChannel = parseLocalStorage().userChannels.includes(
      messageData.newChannel
    );
    createChannelNotification(checkChannel, messageData.newChannel);
  } else if (data.activeChannel == messageData.current) {
    let item = document.createElement("li");
    item.classList.add("message");

    let date = `[${formatAMPM(new Date())}]`;
    let user = `<span class="username">@${messageData.user}</span>`;
    $messagesView.appendChild(item).innerHTML += `${date} ${user} ${
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
    showNotification(messageData, document.hidden);
  } else {
    saveMessages(
      messageData.text,
      data,
      messageData.user,
      messageData.date,
      messageData.current
    );
    //Notication when no channel active
    showNotification(messageData, !document.hidden);
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

function showWelcomeUsername() {
  const $titleMessage = document.getElementsByTagName("h1")[0];
  $titleMessage.textContent += parseLocalStorage().user;
}

$openLightBox.addEventListener("click", () => {
  $inputChannel.focus();
});

$deleteLocalStorage.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

$allowNotifications.addEventListener("click", () => {
  Notification.requestPermission().then(value => {
    localStorage.setItem("notification", value);
    $allowNotifications.style.backgroundColor = "rgb(150, 253, 109)";
  });
});
showNotification = (messageData, visible) => {
  if (localStorage.getItem("notification") == "granted" && visible) {
    let body = {
      body: `${messageData.user} says: ${messageData.text}`
    };
    new Notification(`${messageData.current}`, body);
  }
};

createChannelNotification = (checkChannel, newChannel) => {
  if (!checkChannel && localStorage.getItem("notification") == "granted") {
    let body = {
      body: `${newChannel} created`
    };
    new Notification("New Channel", body);
  }
};

showWelcomeUsername();
function focusMessagesInput() {
  let $inputMessage = document.getElementById("js-input-user-message");
  $inputMessage.focus();
}
