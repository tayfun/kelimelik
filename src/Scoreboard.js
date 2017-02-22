import React from 'react';
import Tile from './Tile';
import './Scoreboard.css';


class Scoreboard extends React.Component {

  render() {
    let scoreboards = [];
    for (var i = 0; i < this.props.racks.length; i++) {
      let tiles = [];
      let tileKey = 0;
      for (let letter of this.props.racks[i]) {
        tiles.push(<Tile value={letter} tentative='true' key={tileKey} />);
        tileKey++;
      }
      scoreboards.push(
        <div className='scoreboard' key={i}>
          <div className='player-details'>
            <span className='score'>
              Score: {this.props.scores[i]}
            </span>
          </div>
          <div className='rack'>
            {tiles}
          </div>
        </div>
      );
    }
    return (
      <div id='scoreboards'>{scoreboards}</div>
    );
  }
}

export default Scoreboard;
