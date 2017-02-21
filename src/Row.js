import React from 'react';
import Tile from './Tile';

class Row extends React.Component {

  render() {
    var tiles = [];
    for (var i = 0; i < this.props.tiles.length; i++) {
      tiles.push(<Tile type={this.props.tiles[i]} key={i}/>)
    }
    return (
      <div className='row'>{tiles}</div>
    )
  }
}

export default Row;
