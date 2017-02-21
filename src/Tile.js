import React from 'react';

var Tile = React.createClass({
    getInitialState: function() {
      // Which class attribute this tile div will have.
      var klass = "";
      switch (this.props.type) {
        case ":":
          klass = "dl";
          break;
        case ";":
          klass = "tl";
          break;
        case "*":
          klass = "star";
          break;
        case "-":
          klass = "dw";
          break;
        case "=":
          klass = "tw";
          break;
        case '.':  // case '.':
          klass = "sl";
          break;
        default:
          klass = ""
      }
      return {
        "klass": klass,
      };
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
        <div className="tile empty">
          <span>
            {this.state.klass}
          </span>
        </div>
      );
    }
});


export default Tile;
