import React from "react";
import ReactDOM from "react-dom";
import _ from 'lodash';

class Tile extends React.Component {
  constructor(props) {
    super(props);
    // binding
    // this.clickHandler = this.clickHandler.bind(this);
  }
  render() {
    return (
      <div className={`square ${this.props.type} ${this.props.state}`} id={this.props.number}
           onClick={() => this.props.onClick()}>
        <div className="flipper">
          <div className="front"></div>
          <div className="back"></div>
        </div>
      </div>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.numOfTiles = 8;
    this.tilesTypes = ['sun', 'bug', 'heart', 'owl', 'car'];
    this.state = {
      deck: []
    };
    // binding
    this.shuffleDeck = this.shuffleDeck.bind(this);
    this.shuffleDeck();
  }
  shuffleDeck() {
    let deck = _.shuffle(this.tilesTypes);
    deck = _.take(deck, this.numOfTiles/2);
    deck = [...deck, ...deck];
    deck = _.shuffle(deck);
    this.state.deck = deck.map((x, i)=>{
      return { id: i, flip: false, type: x}
    });
  }
  handleClick(i) {
    const deck = this.state.deck.slice();
    deck[i].flip = true;
    this.setState({deck: deck});
  }
  renderTiles() {
    let tiles = [];
    for (let i = 0; i<this.state.deck.length; i++) {
      tiles.push(<Tile
        key={i}
        number={i}
        state={(this.state.deck[i].flip)?'flipped':''}
        onClick={() => this.handleClick(i)}
        type={this.state.deck[i].type} />);
    }
    return tiles;
  }
  render() {
    return (
      <div className="board">
        {this.renderTiles()}
      </div>
    );
  }
}

const amemory = document.getElementById("amemory");

if (amemory) ReactDOM.render(<Board />, amemory);