export const LOWERCASE_LIST = 'abcçdefgğhıijklmnoöprsştuüvyz';
const UPPERCASE_LIST = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
const LOWERCASE_SET = new Set(LOWERCASE_LIST);
const UPPERCASE_SET = new Set(UPPERCASE_LIST);

function toLowerCaseLetter(letter) {
  if (LOWERCASE_SET.has(letter)) {
    return letter;
  }
  letter_index = UPPERCASE_LIST.indexOf(letter);
  if (letter_index === -1) {
    return letter.toLowerCase();
  }
  return LOWERCASE_LIST[letter_index];
}

function toUpperCaseLetter(letter) {
  if (UPPERCASE_SET.has(letter)) {
    return letter;
  }
  letter_index = LOWERCASE_LIST.indexOf(letter);
  if (letter_index === -1) {
    return letter.toUpperCase();
  }
  return UPPERCASE_LIST[letter_index];
}

function convertEachLetter(my_str, my_fun){
  var result_str = '';
  for (letter of my_str) {
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
