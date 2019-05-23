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