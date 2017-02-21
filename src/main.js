import {LOWERCASE_LIST, toLowerCase, toUpperCase} from './turkish.js';

var dictionary_file = '/static/enable1.txt';
var dictionary = new Set();
var PREFIXES;
$.get(dictionary_file, function(data){
    dictionary = new Set(
        data.trim().split('\n').map(
            function(word){return word.trim().toUpperCase();})
        );
    PREFIXES = dict_prefixes(dictionary);
});
function isWord(word) {
    return dictionary.has(word.toUpperCase());
}
var BLANK = '_';
// var ALL_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
var UPPER_TO_LOWER_MAP = {
  "A": 'a', "B": 'b', "C": 'c', "Ç": 'ç', "D": 'd', "E": 'e', "F": 'f', "G": 'g', "Ğ": 'ğ',
  "H": 'h', "I": 'ı', "İ": 'i', "J": 'j', "K": 'k', "L": 'l', "M": 'm', "N": 'n', "O": 'o',
  "Ö": 'ö', "P": 'p', "R": 'r', "S": 's', "Ş": 'ş', "T": 't', "U": 'u', "Ü": 'ü', "V": 'v',
  "Y": 'y', "Z": 'z'
};
var ALL_LETTERS_LOWERCASE = 'abcçdefgğhıijklmnoöprsştuüvyz';
var ALL_LETTERS_UPPERCASE = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';


// var POINTS = {
//     "A": 1, "B": 3, "C": 3, "D": 2, "E": 1, "F": 4, "G": 2, "H": 4, "I": 1,
//     "J": 8, "K": 5, "L": 1, "M": 3, "N": 1, "O": 1, "P": 3, "Q": 10, "R": 1,
//     "S": 1, "T": 1, "U": 1, "V": 4, "W": 4, "X": 8, "Y": 4, "Z": 10,
// };
var POINTS = {
  "A": 1, "B": 3, "C": 4, "Ç": 4, "D": 3, "E": 1, "F": 7, "G": 5, "Ğ": 8,
  "H": 5, "I": 2, "İ": 1, "J": 10, "K": 1, "L": 1, "M": 2, "N": 1, "O": 2,
  "Ö": 7, "P": 5, "R": 1, "S": 2, "Ş": 4, "T": 1, "U": 2, "Ü": 3, "V": 3,
  "Y": 3, "Z": 4
}
// cat = ''.join
// my_arr.join('') should be used instead here.
function join(board, start, stop, step) {
    var joined = '';
    for (var i = start; i < stop; i += step) {
        joined += board[i];
    }
    return joined;
}

function letters(rack) {
    if (rack.indexOf(BLANK) > -1) {
        return Array.from(
            // Isn't below just `new Set(ALL_LETTERS)`?
            new Set(rack.replace(BLANK, '') + ALL_LETTERS)
        ).join('');
    } else {
        return Array.from(new Set(rack)).join('');
    }
}

function isAlpha(letter) {
    return /^[a-z]$/i.test(letter);
}

function remove(tiles, rack) {
    for (var tile of tiles) {
        // Not sure why we're not doing `tile === '_'` here. Also, can use
        // tile.toLowerCase for English.
        if (tile === UPPER_TO_LOWER_MAP[tile]) {
            tile = BLANK;
        }
        rack = rack.replace(tile, '');
    }
    return rack;
}

var ACROSS = 1;
var OFF = '#';
var EMPTY = '.:;*-=';
// Damn, destructuring assignment coming only in Chrome 49:
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
// That's unpacking in Python BTW.
// How about using it now and having Babel transpile it?
var SL = EMPTY[0], DL = EMPTY[1], TL = EMPTY[2], STAR = EMPTY[3];
var DW = EMPTY[4], TW = EMPTY[5];

var spaces_re = /\s*/;

// ES6 class, otherwise extending array is not trivial:
// http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
class Board extends Array {
    constructor(squares) {
        super(...squares);
        var down = Math.sqrt(squares.length);
        this.down = down;
        this.directions = [ACROSS, down, -ACROSS, -down];
        this.number_of_passes = 0;
    }

    print() {
        for (var i=0; i < this.length; i++) {
            var start = i * this.down;
            var end = start + this.down;
            console.log(this.slice(start, end).join('  '));
        }
    }

    pass() {
        this.number_of_passes++;
    }
}

var WWF = new Board(`
    # # # # # # # # # # # # # # # # #
    # . . . = . . ; . ; . . = . . . #
    # . . : . . - . . . - . . : . . #
    # . : . . : . . . . . : . . : . #
    # = . . ; . . . - . . . ; . . = #
    # . . : . . . : . : . . . : . . #
    # . - . . . ; . . . ; . . . - . #
    # ; . . . : . . . . . : . . . ; #
    # . . . - . . . * . . . - . . . #
    # ; . . . : . . . . . : . . . ; #
    # . - . . . ; . . . ; . . . - . #
    # . . : . . . : . : . . . : . . #
    # = . . ; . . . - . . . ; . . = #
    # . : . . : . . . . . : . . : . #
    # . . : . . - . . . - . . : . . #
    # . . . = . . ; . ; . . = . . . #
    # # # # # # # # # # # # # # # # #
`.trim().split(spaces_re));

function Play(start, dir, letters, rack) {
    // So that we can omit `new`. I know, not a big deal, but still.
    // if (!this instanceof Play) {
    //     return new Play(start, dir, letters, rack);
    // }
    this.start = start;
    this.dir = dir;
    this.letters = letters;
    this.rack = rack;
}

function make_play(board, play) {
    var copy = new Board(board);
    for (var i = 0; i < play.letters.length; i++) {
        copy[play.start + i * play.dir] = play.letters[i];
    }
    return copy;
}

/*
var DOWN = WWF.down;
var plays = [
    new Play(145, DOWN, 'ENTER'),
    new Play(144, ACROSS, 'BE'),
    new Play(138, DOWN, 'GAVE'),
    new Play(158, DOWN, 'MUSES'),
    new Play(172, ACROSS, 'VIRULeNT'),
    new Play(213, ACROSS, 'RED'),
    new Play(198, ACROSS, 'LYTHE'),
    new Play(147, DOWN, 'CHILDREN'),
    new Play(164, ACROSS, 'HEARD'),
    new Play(117, DOWN, 'BRIDLES'),
    new Play(131, ACROSS, 'TOUR'),
];

var board = new Board(WWF);
for (var play of plays){
    board = make_play(board, play);
}
board.print();
*/
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


function rack_prefixes(rack) {
    return extend_prefixes('', rack, new Set());
}

function extend_prefixes(prefix, rack, results) {
    if (PREFIXES.has(prefix.toUpperCase())) {
        results.add(prefix);
        for (var L of letters(rack)) {
            extend_prefixes(prefix + L, remove(L, rack), results);
        }
    }
    return results;
}

function is_anchor(board, s) {
    if (board[s] == STAR) {
        return true;
    } else if (EMPTY.indexOf(board[s]) == -1) {
        return false;
    }
    for (var direction of board.directions) {
        if (isAlpha(board[s + direction])) {
            return true;
        }
    }
    return false;
}

function all_anchors(board) {
    var anchors = [];
    for (var i = 0; i < board.length; i++) {
        if (is_anchor(board, i)){
            anchors.push(i);
        }
    }
    return anchors;
}

// ES6 generator function definition.
function* all_plays(board, rack) {
    var anchors = all_anchors(board);
    var prefixes = rack_prefixes(rack);
    yield new Play(0, 1, '', rack);
    for (var anchor of anchors) {
        for (var dir of [ACROSS, board.down]) {
            for (var play of prefix_plays(prefixes, board, anchor, dir, rack)) {
                yield* extend_play(board, play);
            }
        }
    }
}

function prefix_plays(prefixes, board, anchor, dir, rack) {
    if (isAlpha(board[anchor - dir])) {
        var start = scan_letters(board, anchor, -dir);
        var letters = [];
        for (var i = start; i < anchor; i = i + dir) {
            letters.push(board[i]);
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

function* extend_play(board, play) {
    var s = play.start + play.dir * play.letters.length;
    if (board[s] == OFF) { return; }
    var cword = crossword(board, s, play.dir);
    var possible_letters;
    if (isAlpha(board[s])) {
        possible_letters = board[s].toUpperCase();
    } else {
        possible_letters = letters(play.rack);
    }
    for (var L of possible_letters) {
        var prefix2 = play.letters + L;
        if (PREFIXES.has(prefix2.toUpperCase()) && valid_crossword(cword, L)) {
            var rack2;
            if (isAlpha(board[s])) {
                rack2 = play.rack;
            } else {
                rack2 = remove(L, play.rack);
            }
            var play2 = new Play(play.start, play.dir, prefix2, rack2);
            if (isWord(prefix2) && !isAlpha(board[s + play.dir])) {
                yield play2;
            }
            yield* extend_play(board, play2);
        }
    }
}

function scan_letters(board, s, dir){
    while(isAlpha(board[s + dir])) {
        s += dir;
    }
    return s;
}

function scan_to_anchor(board, s, dir) {
    while(board[s + dir] != OFF && !is_anchor(board, s + dir)) {
        s += dir;
    }
    return s;
}

function crossword(board, s, dir) {
    // Arrow function expression, basically anonymous function.
    // Also using ternary operator.
    var canonical = L => isAlpha(L) ? L : '.';
    var d = other(dir, board);
    var start = scan_letters(board, s, -d);
    var end = scan_letters(board, s, d);
    var cw = "";
    for (var i = start; i <= end; i += d) {
        cw += canonical(board[i]);
    }
    return cw;
}

function valid_crossword(cword, L) {
    return cword.length == 1 || dictionary.has(cword.replace('.', L).toUpperCase());
}

function other(dir, board) {
    return dir == ACROSS ? board.down : ACROSS;
}

function score(board, play) {
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
        var s = play_tuple[0], L = play_tuple[1];
        var sq = board[s];
        word_bonus *= sq == TW ? 3: (sq == DW ? 2 : 1);
        // We don't have defaultdict in JS, and lower case letters are
        // not to be counted in scoring.
        total += (POINTS[L] || 0) * (sq == TL ? 3 : (sq == DL ? 2 : 1));
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
        var s = play_tuple[0], L = play_tuple[1];
        if (isEmpty(board, s)) {
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

function isEmpty(board, s) {
    return EMPTY.indexOf(board[s]) != -1;
}

function* cross_plays(board, play) {
    var cross = other(play.dir, board);
    for (var play_tuple of enumerate_play(play)) {
        var s = play_tuple[0], L = play_tuple[1];
        if (isEmpty(board, s) && (isAlpha(board[s-cross]) || isAlpha(board[s+cross]))) {
            var start = scan_letters(board, s, -cross), end = scan_letters(board, s, cross);
            var before = join(board, start, s, cross), after = join(board, s+cross, end+cross, cross);
            yield new Play(start, cross, before + L + after, play.rack);
        }
    }
}

function highest_scoring_play(board, rack) {
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

function shuffle(arr) {
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

var BAG = 'AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ__';

// Function default parameters a la Python comes to ES6, and Chrome 49.
// There's an ugly hack for named parameters (uses destructuring - make
// the argument an object for both definition and calling) but won't be
// used here.
function play_game(verbose=true, strategies=[highest_scoring_play, highest_scoring_play]) {
    var board = new Board(WWF);
    var bag = shuffle(Array.from(BAG));
    var scores = [0, 0];
    var racks = [replenish('', bag), replenish('', bag)];
    while (true) {
        var old_board = board;
        for (let p=0; p < strategies.length; p++) {
            let strategy = strategies[p];
            board = make_one_play(board, p, strategy, scores, racks, bag, verbose);
            if (racks[p]  === '') {
                // Player p has gone out; game over.
                return subtract_remaining_tiles(racks, scores, p);
            }
        }
        if (old_board == board) {
            // No player has a move; game over.
            return scores;
        }
    }
}

function make_one_play(board, p, strategy, scores, racks, bag, verbose) {
    var rack = racks[p];
    var play = strategy(board, racks[p]);
    if (!play) {
        // Couldn't create a valid play with the letters we have.
        board.pass();
        console.log("Pass! This is number " + board.number_of_passes);
        return board;
    }
    racks[p] = replenish(play.rack, bag);
    var points = score(board, play);
    scores[p] += points;
    board = make_play(board, play);
    if (verbose) {
        board.print();
    }
    return board;
}

function subtract_remaining_tiles(racks, scores, p) {
    for (var i = 0; i < racks.length; i++) {
        let points = 0;
        for (let L of racks[i]) {
            points += POINTS[L] || 0;
        }
        scores[i] -= points;
        scores[p] += points;
    }
    return scores;
}

function replenish(rack, bag) {
    while (rack.length < 7 && bag.length) {
        rack += bag.pop();
    }
    return rack;
}

function test() {
    var same = (a, b) => a.sort() == b.sort();
    console.assert(isWord('WORD'));
    // console.profile();
    console.time("testing game scores");
    var games = 4;
    var scores = [];
    for (var i=0; i < games; i++) {
        scores = scores.concat(play_game(false));
    }
    debugger;
    scores.sort((a, b) => a - b);
    var sum = scores.reduce((a, b) => a + b);
    var median = scores[games];
    var mean = sum / (2 * games);
    var max = scores[games * 2 - 1];
    console.log("Min: %d; Median: %d; Mean: %d; Max: %d", scores[0], median, mean, max);
    // console.profileEnd();
    console.timeEnd("testing game scores");
    console.log('%cok', "color: green; background: #eee;");
    console.assert(mean > 350);
    console.assert(median > 350);
}
