import React from 'react';
// TODO: Move tile related CSS to Tile.css
// import './Tile.css';

var Tile = React.createClass({

    getTileContent: function() {
      var letter, superscript;
      switch (this.props.value) {
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
        case 'sl':
          letter = '';
          superscript = '';
          break;
        default:
          letter = this.props.value;
          superscript = '';
      }
      return <span className='tile-background'>{letter}<sup>{superscript}</sup></span>;
    },

    render: function() {
      let classNames;
      // Border tile.
      if (this.props.value === '#') {
        return null;
      }
      if (this.props.value.length !== 2) {
        classNames = 'tile letter';
      } else {
        classNames = 'tile ' + this.props.value;
      }
      if (this.props.tentative) {
        classNames += ' tentative';
      }
      return (
        <div className={classNames}>
          {this.getTileContent()}
        </div>
      );
    }
});


export default Tile;
