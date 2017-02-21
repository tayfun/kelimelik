import React from 'react';
import Row from './Row';

class Board extends React.Component {
  length() {
    // Includes borders as well
    return Math.sqrt(this.props.tiles.length);
  }

  render() {
    var rows = [];
    var board_size = this.length();
    for (var i = 0, j = 0; j < board_size; j++) {
      var next_i = i + board_size;
      rows.push(<Row tiles={this.props.tiles.slice(i, next_i)} key={j} />);
      i = next_i;
    }
    return (
      <div id='board'>
        {rows}
      </div>
    );
  }
}

export default Board;
