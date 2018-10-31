import React from 'react';
import _ from 'lodash';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.numOfTiles = 20;
    this.numOfTypes = this.numOfTiles/2;
    this.busy = false;
    this.tilesTypes = ['sun', 'bug', 'heart', 'owl', 'car', 'flower', 'mushroom', 'dice', 'present', 'pencil', 'cloud', 'frog', 'house', 'butterfly'];
    this.state = {
      deck: [],
      found: 0,
      turn: 0,
    };
    this.shuffleDeck();
    this.checkPair = this.checkPair.bind(this);
  }
  shuffleDeck() {
    let deck = _.shuffle(this.tilesTypes);
    deck = _.take(deck, this.numOfTiles/2);
    deck = [...deck, ...deck];
    deck = _.shuffle(deck);
    this.state.deck = deck.map((x, i)=>{
      return { id: i, flip: false, remove: false, type: x}
    });
  }
  handleClick(i) {
    if (!this.busy && !this.state.deck[i].remove && !this.state.deck[i].flip) {
      this.busy = true;
      this.props.increment();
      let deck = this.state.deck;
      let turn = this.state.turn;
      deck[i].flip = true;
      this.setState({
        deck: deck,
        turn: ++turn
      });
      if (turn === 2) {
        setTimeout(this.checkPair, 500);
      } else {
        this.busy = false;
      }
    }
  }
  checkPair() {
    let state = this.state;
    let flipped = _.filter(state.deck, (o) => o.flip );
    let i = flipped[0];
    let j = flipped[1];
    if (i.type === j.type) {
      state.deck[i.id].remove = true;
      state.deck[j.id].remove = true;
      state.found++;
      if (state.found === this.numOfTypes) {
        this.props.endGame(true);
      }
    }
    state.deck[i.id].flip = false;
    state.deck[j.id].flip = false;
    state.turn = 0;
    this.setState(state);
    this.busy = false;
  }
  renderTiles() {
    let tiles = [];
    for (let i = 0; i<this.state.deck.length; i++) {
      tiles.push(<Tile
        key={i}
        number={i}
        flip={(this.state.deck[i].flip)}
        remove={(this.state.deck[i].remove)}
        onClick={(!this.state.deck[i].remove) ? () => this.handleClick(i) : () => {}}
        type={this.state.deck[i].type} />);
    }
    return tiles;
  }
  render() {
    const started = (this.props.active) ? ' is-hidden' : '';
    return (
      <div className="board">
        <div className={`start-wrapper${started}`}>
          <button className={'button is-large is-rounded start-button'} onClick={()=>this.props.onStart()}>Start</button>
        </div>
        {this.renderTiles()}
      </div>
    );
  }
}

class Tile extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const flip = (this.props.flip) ? ' flip' : '';
    const remove = (this.props.remove) ? ' remove' : '';
    return (
      <div className={`square ${this.props.type}${flip}${remove}`} id={this.props.number}
           onClick={() => this.props.onClick()}>
        <div className="flipper">
          <div className="front"></div>
          <div className="back"></div>
        </div>
      </div>
    );
  }
}