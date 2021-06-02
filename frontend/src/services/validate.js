const nameRE = new RegExp(/^[a-z0-9_-]+$/);
const emailRE = new RegExp(
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
);

export function testName(input) {
  if (input.length < 3) {
    return 'Username needs to be 3 characters minimum.';
  }
  if (!nameRE.test(input)) {
    return 'Username can only contain small letters a-z and 0-9.';
  }
  return '';
}

export function testEmail(input) {
  if (!input.length) {
    return 'Email cannot be empty.';
  }
  if (!emailRE.test(input)) {
    return 'Email needs to be valid.';
  }
  return '';
}

export function testPassword(input) {
  if (!input.length) {
    return 'Password cannot be empty.';
  }
  if (input.length < 8) {
    return 'Password needs to be 8 characters minimum.';
  }
  return '';
}
