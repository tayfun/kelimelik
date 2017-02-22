import React from 'react';
import Row from './Row';
import Scoreboard from './Scoreboard';
import * as Util from './Util';

class Board extends React.Component {

  render() {
    var rows = [];
    for (var i = 0, j = 0; j < this.state.down; j++) {
      var next_i = i + this.state.down;
      rows.push(<Row tiles={this.state.tiles.slice(i, next_i)} key={j} />);
      i = next_i;
    }
    return (
      <div id='wrapper'>
        <div id='board'>
          {rows}
        </div>
        <div id='controls'>
          <div id='settings'>
            <button onClick={this.startGame}>
              Start Game
            </button>
          </div>
          <Scoreboard racks={this.state.racks} scores={this.state.scores} />
        </div>
      </div>
    );
  }

  constructor(props) {
    super(props);
    // Bind methods.
    this.startGame = this.startGame.bind(this);
    this.playGame = this.playGame.bind(this);
    this.makeOnePlay = this.makeOnePlay.bind(this);
    this.makePlay = this.makePlay.bind(this);
    this.subtractRemainingTiles = this.subtractRemainingTiles.bind(this);
    this.pass = this.pass.bind(this);

    let spaces_re = /\s+/;
    // Each empty cell has two letters. Borders are '#'. Occupied cells have a single letter.
    var kelimelik_tiles = `
        # #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #
        # sl sl tw sl sl dl sl sl sl dl sl sl tw sl sl #
        # sl tl sl sl sl sl dl sl dl sl sl sl sl tl sl #
        # tw sl sl sl sl sl sl dw sl sl sl sl sl sl tw #
        # sl sl sl dw sl sl sl sl sl sl sl dw sl sl sl #
        # sl sl sl sl tl sl sl sl sl sl tl sl sl sl sl #
        # dl sl sl sl sl dl sl sl sl dl sl sl sl sl dl #
        # sl dl sl sl sl sl dl sl dl sl sl sl sl dl sl #
        # sl sl dw sl sl sl sl st sl sl sl sl dw sl sl #
        # sl dl sl sl sl sl dl sl dl sl sl sl sl dl sl #
        # dl sl sl sl sl dl sl sl sl dl sl sl sl sl dl #
        # sl sl sl sl tl sl sl sl sl sl tl sl sl sl sl #
        # sl sl sl dw sl sl sl sl sl sl sl dw sl sl sl #
        # tw sl sl sl sl sl sl dw sl sl sl sl sl sl tw #
        # sl tl sl sl sl sl dl sl dl sl sl sl sl tl sl #
        # sl sl tw sl sl dl sl sl sl dl sl sl tw sl sl #
        # #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #
    `.trim().split(spaces_re);
    // Includes borders as well
    let down = Math.sqrt(kelimelik_tiles.length);
    let bag = Util.shuffle(Array.from(Util.BAG));
    let first_rack = Util.replenish('', bag);
    let second_rack = Util.replenish('', bag);
    this.state = {
      down: down,
      directions: [Util.ACROSS, down, -Util.ACROSS, -down],
      number_of_passes: 0,
      // String representing letters left in the bag.
      bag: bag,
      scores: [0, 0],
      // Two strings representing each player's racks.
      racks: [first_rack, second_rack],
      // A list, representing the board. Each cell is a string representing the
      // cell content. eg. # is border, DL is double letter.
      tiles: kelimelik_tiles,
    };
  }

  startGame(e) {
    this.playGame();
  }

  async playGame(strategies=[Util.highest_scoring_play, Util.highest_scoring_play]) {
    while (true) {
      var old_board_tiles = this.state.tiles.slice();
      for (let p = 0; p < strategies.length; p++) {
        let strategy = strategies[p];
        this.makeOnePlay(p, strategy);
        if (this.state.racks[p] === '') {
          // Player p has gone out; game over.
          this.setState((prevState, props) => ({
            scores: this.subtractRemainingTiles(prevState.scores, p)
          }));
          return;
        }
        // Pause so that it is not too fast.
        await Util.sleep(3500);
      }
      if (Util.array_equal(old_board_tiles, this.state.tiles)) {
        // No player has a move; game over.
        return;
      }
    }
  }

  makeOnePlay(p, strategy) {
    let rack = this.state.racks[p];
    let play = strategy(this, rack);
    if (!play) {
      // Couldn't create a valid play with the letters we have.
      this.pass();
      return;
    }
    let new_rack = Util.replenish(play.rack, this.state.bag);
    let points = Util.score(this, play);
    let new_score = this.state.scores[p] + points;
    this.setState((prevState, props) => ({
      tiles: this.makePlay(prevState.tiles, play)
    }));
    let newScoresRacks;
    if (p === 0) {
      newScoresRacks = {
        racks: [new_rack, this.state.racks[1]],
        scores: [new_score, this.state.scores[1]]
      }
    } else {
      newScoresRacks = {
        racks: [this.state.racks[0], new_rack],
        scores: [this.state.scores[0], new_score]
      }
    }
    this.setState(newScoresRacks);
  }

  makePlay(tiles, play) {
    for (var i = 0; i < play.letters.length; i++) {
      tiles[play.start + i * play.dir] = play.letters[i];
    }
    return tiles;
  }

  subtractRemainingTiles(scores, p) {
    // Copy scores, as we'll use setState.
    let new_scores = scores.slice();
    for (var i = 0; i < this.state.racks.length; i++) {
      let points = 0;
      for (let L of this.state.racks[i]) {
        points += Util.POINTS[L] || 0;
      }
      new_scores[i] -= points;
      new_scores[p] += points;
    }
    return new_scores;
  }

  pass() {
    this.state.number_of_passes++;
    console.log("Pass! This is number " + this.state.number_of_passes);
  }
}

export default Board;
