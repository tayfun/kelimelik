import {LOWERCASE_STR, LOWERCASE_SET, toUpperCase, isAlpha} from './turkish.js';

export const ACROSS = 1;

export const POINTS = {
  "A": 1, "B": 3, "C": 4, "Ç": 4, "D": 3, "E": 1, "F": 7, "G": 5, "Ğ": 8,
  "H": 5, "I": 2, "İ": 1, "J": 10, "K": 1, "L": 1, "M": 2, "N": 1, "O": 2,
  "Ö": 7, "P": 5, "R": 1, "S": 2, "Ş": 4, "T": 1, "U": 2, "Ü": 3, "V": 3,
  "Y": 3, "Z": 4
}

export const BAG = 'AAAAAAAAAAAABBCCÇÇDDEEEEEEEEFGĞHIIIIİİİİİİİJKKKKKKKLLLLLLLMMMMNNNNNOOOÖPRRRRRRSSSŞŞTTTTTUUUÜÜVYYZZ__';

function Play(start, dir, letters, rack) {
  /*
   * Start is the square number this play starts at.
   * Dir is the direction we are playing, it is +1 for horizontal and
   * +row_size for vertical plays.
   * rack is the string representing letters the player has.
  */
  // So that we can omit `new`. I know, not a big deal, but still.
  // if (!this instanceof Play) {
  //     return new Play(start, dir, letters, rack);
  // }
  this.start = start;
  this.dir = dir;
  this.letters = letters;
  this.rack = rack;
}

var dictionary_file = '/static/turkish_words.txt';
var dictionary = new Set();
var PREFIXES;

fetch(dictionary_file).then(function(response){
  return response.text();
}).then(function(data){
  dictionary = new Set(data.split('\n'));
  PREFIXES = dict_prefixes(dictionary);
});

function dict_prefixes(dictionary) {
  var prefixes = new Set();
  for (var word of dictionary) {
    for (var i = 1; i < word.length; i++) {
      prefixes.add(word.slice(0, i));
    }
  }
  prefixes.add('');
  return prefixes;
}


function isWord(word) {
  return dictionary.has(toUpperCase(word));
}
var BLANK = '_';
var OFF = '#';


function letters(rack) {
  if (rack.indexOf(BLANK) > -1) {
    return Array.from(
      new Set(LOWERCASE_STR + rack.replace(BLANK, ''))
    ).join('');
  } else {
    return Array.from(new Set(rack)).join('');
  }
}

function remove(tiles, rack) {
  // Removes letters (tiles) from rack (which is a string). Lower case letters represent blank tiles which do not have points.
  for (var tile of tiles) {
    if (LOWERCASE_SET.has(tile)) {
      tile = BLANK;
    }
    rack = rack.replace(tile, '');
  }
  return rack;
}

export function highest_scoring_play(board, rack) {
  var max_score = 0;
  var max_play;
  for (var play of [...all_plays(board, rack)]) {
    var new_score = score(board, play);
    if (new_score > max_score) {
      max_score = new_score;
      max_play = play;
    }
  }
  return max_play;
}

// ES6 generator function definition.
function* all_plays(board, rack) {
  var anchors = all_anchors(board);
  var prefixes = rack_prefixes(rack);
  yield new Play(0, 1, '', rack);
  for (var anchor of anchors) {
    for (var dir of [ACROSS, board.state.down]) {
      for (var play of prefix_plays(prefixes, board, anchor, dir, rack)) {
        yield* extend_play(board, play);
      }
    }
  }
}

function prefix_plays(prefixes, board, anchor, dir, rack) {
  if (isAlpha(board.state.tiles[anchor - dir])) {
    var start = scan_letters(board, anchor, -dir);
    var letters = [];
    for (var i = start; i < anchor; i += dir) {
      letters.push(board.state.tiles[i]);
    }
    return [new Play(start, dir, letters.join(''), rack)];
  } else {
    var valid_plays = [];
    var maxlen = (anchor - scan_to_anchor(board, anchor, -dir)) / dir;
    for (var prefix of prefixes) {
      if (prefix.length <= maxlen) {
        valid_plays.push(
          new Play(anchor - prefix.length * dir, dir, prefix, remove(prefix, rack)));
      }
    }
    return valid_plays;
  }
}

function scan_to_anchor(board, square, dir) {
  while(board.state.tiles[square + dir] !== OFF && !is_anchor(board, square + dir)) {
    square += dir;
  }
  return square;
}

function scan_letters(board, square, dir){
  while(isAlpha(board.state.tiles[square + dir])) {
    square += dir;
  }
  return square;
}

function all_anchors(board) {
  var anchors = [];
  for (var i = 0; i < board.state.tiles.length; i++) {
    if (is_anchor(board, i)){
      anchors.push(i);
    }
  }
  return anchors;
}

function is_anchor(board, square) {
  if (board.state.tiles[square] === 'st') {
    return true;
  } else if (board.state.tiles[square].length !== 2) {
    return false;
  }
  for (var direction of board.state.directions) {
    if (isAlpha(board.state.tiles[square + direction])) {
      return true;
    }
  }
  return false;
}

function rack_prefixes(rack) {
  return extend_prefixes('', rack, new Set());
}

function extend_prefixes(prefix, rack, results) {
  if (PREFIXES.has(toUpperCase(prefix))) {
    results.add(prefix);
    for (var L of letters(rack)) {
      extend_prefixes(prefix + L, remove(L, rack), results);
    }
  }
  return results;
}

export function shuffle(arr) {
  // Knuth-Fisher-Yates algorithm. Unlike Python, JS doesn't have shuffle
  // in standard libraries, so we're forced to implement it.
  // Jeff Atwood has a good writeup on http://blog.codinghorror.com/the-danger-of-naivete/
  for (var i = arr.length; i > 0; i--) {
    var rand_place = Math.floor(Math.random() * i);
    var temp = arr[rand_place];
    arr[rand_place] = arr[i - 1];
    arr[i - 1] = temp;
  }
  return arr;
}

export function array_equal(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

export function replenish(rack, bag) {
  while (rack.length < 7 && bag.length) {
    rack += bag.pop();
  }
  return rack;
}

export function score(board, play) {
  // Note how generator is used.
  var cross_word_scores = [...cross_plays(board, play)].map(
    function(cplay) {return word_score(board, cplay);}
  );
  var cross_sum = cross_word_scores.reduce((prev, cur) => prev + cur, 0);
  return word_score(board, play) + bingo(board, play) + cross_sum;
}

function word_score(board, play) {
  var total = 0, word_bonus = 1;
  for(var play_tuple of enumerate_play(play)) {
    var play_sq = play_tuple[0], L = play_tuple[1];
    var sq = board.state.tiles[play_sq];
    word_bonus *= sq === 'tw' ? 3: (sq === 'dw' ? 2 : 1);
    // We don't have defaultdict in JS, and lower case letters are
    // not to be counted in scoring.
    total += (POINTS[L] || 0) * (sq === 'tl' ? 3 : (sq === 'dl' ? 2 : 1));
  }
  return word_bonus * total;
}

var BINGO = 35;

function bingo(board, play) {
  return play.rack === '' && letters_played(board, play) === 7 ? BINGO : 0;
}

function letters_played(board, play) {
  var sum = 0;
  for (var play_tuple of enumerate_play(play)) {
    var square = play_tuple[0];
    if (isEmpty(board, square)) {
      sum += 1;
    }
  }
  return sum;
}

function enumerate_play(play) {
  var play_tuples = [];
  for (var i = 0; i < play.letters.length; i++) {
    var L = play.letters[i];
    play_tuples.push([play.start + i * play.dir, L]);
  }
  return play_tuples;
}
function* cross_plays(board, play) {
  var cross = other(play.dir, board);
  for (var play_tuple of enumerate_play(play)) {
    var square = play_tuple[0], L = play_tuple[1];
    if (isEmpty(board, square) && (isAlpha(board.state.tiles[square-cross]) || isAlpha(board.state.tiles[square+cross]))) {
      var start = scan_letters(board, square, -cross), end = scan_letters(board, square, cross);
      var before = join(board, start, square, cross), after = join(board, square+cross, end+cross, cross);
      yield new Play(start, cross, before + L + after, play.rack);
    }
  }
}

function join(board, start, stop, step) {
  var joined = '';
  for (var i = start; i < stop; i += step) {
    joined += board.state.tiles[i];
  }
  return joined;
}

function isEmpty(board, square) {
  return board.state.tiles[square].length === 2;
}

function* extend_play(board, play) {
  var square = play.start + play.dir * play.letters.length;
  if (board.state.tiles[square] === OFF) { return; }
  var cword = crossword(board, square, play.dir);
  var possible_letters;
  if (isAlpha(board.state.tiles[square])) {
    possible_letters = toUpperCase(board.state.tiles[square]);
  } else {
    possible_letters = letters(play.rack);
  }
  for (var L of possible_letters) {
    var prefix2 = play.letters + L;
    if (PREFIXES.has(toUpperCase(prefix2)) && valid_crossword(cword, L)) {
      var rack2;
      if (isAlpha(board.state.tiles[square])) {
        rack2 = play.rack;
      } else {
        rack2 = remove(L, play.rack);
      }
      var play2 = new Play(play.start, play.dir, prefix2, rack2);
      if (isWord(prefix2) && !isAlpha(board.state.tiles[square + play.dir])) {
        yield play2;
      }
      yield* extend_play(board, play2);
    }
  }
}

function valid_crossword(cword, L) {
  return cword.length === 1 || dictionary.has(toUpperCase(cword.replace('.', L)));
}

function crossword(board, square, dir) {
  // Arrow function expression, basically anonymous function.
  // Also using ternary operator.
  var canonical = L => isAlpha(L) ? L : '.';
  var d = other(dir, board);
  var start = scan_letters(board, square, -d);
  var end = scan_letters(board, square, d);
  var cw = "";
  for (var i = start; i <= end; i += d) {
    cw += canonical(board.state.tiles[i]);
  }
  return cw;
}

function other(dir, board) {
  return dir === ACROSS ? board.state.down : ACROSS;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
