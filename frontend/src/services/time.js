export function convertTime(time) {
  time = new Date(time);
  let date = new Date();
  let today = date.setHours(0, 0, 0, 0);
  let yesterday = date.setDate(new Date().getDate() - 1);
  let week = date.setDate(new Date().getDate() - 6);
  date.setHours(23, 59, 59);
  let year = date.setFullYear(new Date().getFullYear() - 1, 11, 31);

  let options = {};
  if (time > today) {
    options = { hour: '2-digit', minute: '2-digit' };
    time = time.toLocaleString('sv-SE', options);
    return 'idag ' + time;
  } else if (time > yesterday) {
    options = { hour: '2-digit', minute: '2-digit' };
    time = time.toLocaleString('sv-SE', options);
    return 'igår ' + time;
  } else if (time > week) {
    options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
    time = time.toLocaleString('sv-SE', options);
    return time;
  } else if (time > year) {
    options = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    time = time.toLocaleString('sv-SE', options);
    return time;
  } else {
    options = { month: 'numeric', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    time = time.toLocaleString('sv-SE', options);
    return time;
  }
}
