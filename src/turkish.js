export const LOWERCASE_STR = 'abcçdefgğhıijklmnoöprsştuüvyz';
const UPPERCASE_STR = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
export const LOWERCASE_SET = new Set(LOWERCASE_STR);
const UPPERCASE_SET = new Set(UPPERCASE_STR);

function toLowerCaseLetter(letter) {
  if (LOWERCASE_SET.has(letter)) {
    return letter;
  }
  let letter_index = UPPERCASE_STR.indexOf(letter);
  if (letter_index === -1) {
    return letter.toLowerCase();
  }
  return LOWERCASE_STR[letter_index];
}

function toUpperCaseLetter(letter) {
  if (UPPERCASE_SET.has(letter)) {
    return letter;
  }
  let letter_index = LOWERCASE_STR.indexOf(letter);
  if (letter_index === -1) {
    return letter.toUpperCase();
  }
  return UPPERCASE_STR[letter_index];
}

function convertEachLetter(my_str, my_fun){
  var result_str = '';
  for (var letter of my_str) {
      result_str += my_fun(letter);
  }
  return result_str;
}

export function toLowerCase(my_str) {
  return convertEachLetter(my_str, toLowerCaseLetter);
}

export function toUpperCase(my_str) {
  return convertEachLetter(my_str, toUpperCaseLetter);
}

export function isAlpha(letter) {
  return UPPERCASE_SET.has(letter) || LOWERCASE_SET.has(letter);
}
