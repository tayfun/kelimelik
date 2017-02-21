import React from 'react';

var Tile = React.createClass({
    getInitialState: function() {
      return {};
    },

    getTileContent: function() {
      var letter, superscript;
      switch (this.props.type) {
        case 'tw':
          letter = 'K';
          superscript = 3;
          break;
        case 'dw':
          letter = 'K';
          superscript = 2;
          break;
        case 'dl':
          letter = 'H';
          superscript = 2;
          break;
        case 'tl':
          letter = 'H';
          superscript = 3;
          break;
        case 'st':
          letter = '★';
          superscript = '';
          break;
        default:
          letter = '';
          superscript = '';
      }
      return <span className='tile-background'>{letter}<sup>{superscript}</sup></span>;
    },

    render: function() {
      // Border tile.
      if (this.props.type === '#') {
        return null;
      }
      if (this.state.letter) {
        return (
          <div className="tile letter">
            <span>
              {this.state.letter}
            </span>
          </div>
        );
      }
      return (
        <div className={'tile ' + this.props.type}>
          {this.getTileContent()}
        </div>
      );
    }
});


export default Tile;
