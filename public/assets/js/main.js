const $buttonLogin = document.getElementById("js-button-loggin");
const $inputUsername = document.getElementById("js-input-username");
const $buttonCreateChannel = document.getElementById(
  "js-button-create-channel"
);
const $inputChannel = document.getElementById("js-input-channel");
const $listUserChannels = document.getElementById("js-list-user-channels");
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const ordinals = [
  "",
  "st",
  "nd",
  "rd",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "st",
  "nd",
  "rd",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "st"
];

$buttonLogin.addEventListener("click", login);

function login() {
  event.preventDefault();
  const username = $inputUsername.value;
  if (username) {
    localStorage.setItem("username", username);
    console.log(`[Save username ${username} in localStorage]`);
  }
}

$buttonCreateChannel.addEventListener("click", handleCreation);
// localStorage.setItem("userChannels", JSON.stringify(["english", "varios", "forobardo"]))
function renderUserChanels() {
  const userChannels = localStorage.getItem("userChannels");
  const arrUserChannels = JSON.parse(userChannels);
  let htmlUserChannels = "";
  arrUserChannels.forEach(channelName => {
    htmlUserChannels += `<li>${channelName}</li>`;
  });
  $listUserChannels.innerHTML = htmlUserChannels;
}

renderUserChanels();

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

//new Date(year, month, date, hours, minutes, seconds, ms)
function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

function formatdate(someDate) {
  let FormattedDate = "";
  let today = new Date();
  let yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  ) {
    FormattedDate = "Today";
  } else if (
    someDate.getDate() == yesterday.getDate() &&
    someDate.getMonth() == yesterday.getMonth() &&
    someDate.getFullYear() == yesterday.getFullYear()
  ) {
    FormattedDate = "Yesterday";
  } else {
    FormattedDate = `${getWeekDay(someDate)}, ${getMonth(
      someDate
    )} ${getformatDay(someDate)} `;
  }
  // return Today, yesterday, "Monday, May 20th"
  return FormattedDate;
}

function getWeekDay(date) {
  return days[date.getDay()];
}

function getMonth(date) {
  return months[date.getMonth()];
}

function getformatDay(date) {
  return `${date.getDate()}${ordinals[date.getDate()]}`;
}
