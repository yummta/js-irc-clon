console.log("Cool");

const $buttonLogin = document.getElementById("js-button-loggin");
const $inputUsername = document.getElementById("js-input-username");

$buttonLogin.addEventListener("click", login);

function login() {
  event.preventDefault();
  const username = $inputUsername.value;
  if (username) {
    localStorage.setItem("username", username);
    console.log(`[Save username ${username} in localStorage]`);
  }
}

let channels = { general: { name: "general" } };
let userChannels = ["general"];
let activeChannel = channels["general"];

function createChannel(channelName) {
  const channelCreated = { channelName: { name: channelName } };
  const channelExists = channels.hasOwnProperty(channelName);
  if (!channelExists) {
    channels[channelName] = channelCreated.channelName;
    joinChannel(channelName);
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
    activeChannel = channels[channelName];
    return activeChannel;
  }
}
