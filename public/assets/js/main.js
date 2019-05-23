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

const $buttonCreateChannel = document.getElementById("js-button-create-channel");
const $inputChannel = document.getElementById("js-input-channel")

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


