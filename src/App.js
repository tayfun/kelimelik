import React, { Component } from 'react';
import Board from './Board';
import './App.css';


var spaces_re = /\s*/;

var tiles = `
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
`.trim().split(spaces_re);


class App extends Component {
  render() {
    return (
      <div className="App">
        <Board tiles={tiles} />
      </div>
    );
  }
}

export default App;
