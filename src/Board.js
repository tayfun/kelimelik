import React from 'react';
import Tile from './Tile';

class Board extends React.Component {
  length() {
    return Math.sqrt(this.props.tiles.length) - 2;
  }

  render() {
    var tiles = [];
    for (var i = 0; i < this.props.tiles.length; i++) {
      tiles.push(<Tile type={this.props.tiles[i]} key={i} />);
    }
    return (
      <div id='board'>
        {tiles}
      </div>
    );
  }
}

export default Board;
