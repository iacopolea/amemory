import React from "react";
import ReactDOM from "react-dom";
import _ from 'lodash';
import moment from 'moment';
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

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.numOfTiles = 12;
    this.busy = false;
    this.tilesTypes = ['sun', 'bug', 'heart', 'owl', 'car', 'flower', 'mushroom', 'dice', 'present', 'pencil', 'cloud', 'frog', 'house', 'butterfly'];
    this.state = {
      deck: [],
      turn: 0,
    };
    // binding
    //this.shuffleDeck = this.shuffleDeck.bind(this);
    this.checkPair = this.checkPair.bind(this);
    this.shuffleDeck();
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
    if (!this.busy) {
      this.busy = true;
      let deck = this.state.deck;
      let turn = this.state.turn;
      deck[i].flip = true;
      this.setState({
        deck: deck,
        turn: ++turn
      });
      if (turn === 2) {
        setTimeout(this.checkPair, 1000);
      } else {
        this.busy = false;
      }
    }
  }
  checkPair() {
    let deck = this.state.deck;
    let flipped = _.filter(this.state.deck, (o) => o.flip );
    let i = flipped[0];
    let j = flipped[1];
    if (i.type === j.type) {
      deck[i.id].remove = true;
      deck[j.id].remove = true;
    }
    deck[i.id].flip = false;
    deck[j.id].flip = false;
    this.setState({
      deck: deck,
      turn: 0
    });
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
    return (
      <div className="board">
        {this.renderTiles()}
      </div>
    );
  }
}

class Timer extends React.Component {
  render() {
    return (
      <div>
        <div>{moment(this.props.time).format('mm:ss:S')}</div>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      updateInterval: 100,
      timerId: false,
      started: false,
      timeStarted: 0,
      timePassed: 0
    };
  }
  componentDidMount() {
    this.startTimer();
  }
  startTimer() {
    let state = this.state;
    state.started = true;
    state.timeStarted = Date.now();
    this.setState(state);
    this.updateTimer();
  }
  stopTimer() {
    let state = this.state;
    clearInterval(state.timerId);
    state.started = false;
    state.timeStarted = 0;
    this.setState(state);
  }
  updateTimer() {
    let state = this.state;
    state.timerId = setInterval( () => {
        let state = this.state;
        if (state.started) {
          state.timePassed = Date.now() - state.timeStarted;
          this.setState(state)
        }
      }
      , state.updateInterval);
    this.setState(state);
  }
  render() {
    return(
      <div>
        <Board active={this.state.started}/>
        <Timer time={this.state.timePassed} />
      </div>
    )
  }
}
const amemory = document.getElementById("amemory");

if (amemory) ReactDOM.render(<Game />, amemory);