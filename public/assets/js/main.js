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
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

function formatdate(someDate) {
  let FormattedDate = "nada";
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
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thrusday",
    "Friday",
    "Saturday"
  ];

  return days[date.getDay()];
}

function getMonth(date) {
  let months = [
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

  return months[date.getMonth()];
}

function getformatDay(date) {
  let ordinals = [
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

  return `${date.getDate()}${ordinals[date.getDate()]}`;
}
