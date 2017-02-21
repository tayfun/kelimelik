import React, { Component } from 'react';
import Board from './Board';
import './App.css';


var spaces_re = /\s+/;

var kelimelik = `
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

class App extends Component {
  render() {
    return (
      <div className="App">
        <Board tiles={kelimelik} />
      </div>
    );
  }
}

export default App;
