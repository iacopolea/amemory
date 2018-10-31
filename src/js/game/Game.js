import React from "react";
import ReactDOM from "react-dom";
import moment from 'moment';
import _ from 'lodash';
import {firebase, db} from '../_firebase';

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
    this.numOfTiles = 16;
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
    console.log(state);
    let flipped = _.filter(state.deck, (o) => o.flip );
    let i = flipped[0];
    let j = flipped[1];
    if (i.type === j.type) {
      state.deck[i.id].remove = true;
      state.deck[j.id].remove = true;
      state.found++;
      if (state.found === this.numOfTypes) {
        this.props.endGame(true);
        this.shuffleDeck();
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

class GameController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: firebase.auth().currentUser
    };
    this.listenToLogin();
  }
  listenToLogin() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({user: user})
    });
  }
  saveResults() {
    const scoreData = {
      userId: this.state.user.uid,
      userName: this.state.user.displayName,
      timestamp: Date.now(),
      time: this.props.time,
      moves: this.props.moves
    };
    this.writeNewScore(scoreData, this.state.user);
  }
  writeNewScore(scoreData, user) {
    let batch = db.batch();
    let usrRef = db.collection('users').doc(user.uid);
    let scoreRef = db.collection('scores').doc();
    const scoreId = scoreRef.id;
    batch.set(usrRef, {scores: {[scoreId]: scoreData}}, {merge: true});
    batch.set(scoreRef, scoreData);

    batch.commit().then(function() {
      //console.log('score saved');
    }).catch(function(err) {
      console.error(err);
    });
  }
  render() {
    return (
      <div className={'game-controller'}>
        <div className={'time'}>{moment(this.props.time).format('mm:ss.S')}</div>
        <div className={'moves'}>Moves: {this.props.moves}</div>
        <div className={'actions'}>
          <button className={'button stop'}
                  disabled={!this.props.active}
                  onClick={()=>this.props.onStop()}>Stop</button>
          <button className={'button save'}
                  disabled={!this.props.canSaveResult}
                  onClick={()=>{this.saveResults()}}>Save</button>
        </div>
        <div className={'user-data'}>
          <span>{(this.state.user) ? this.state.user.displayName : ''}</span>
        </div>
      </div>
    )
  }
}

export default class Game extends React.Component {
  constructor() {
    super();
    this.board = React.createRef();
    this.state = {
      timerId: false,
      started: false,
      timeStarted: 0,
      timePassed: 0,
      moves:0,
      canSaveResult: false
    };
  }
  increment() {
    this.state.moves++;
  }
  startTimer() {
    let state = this.state;
    state.started = true;
    state.timeStarted = Date.now();
    this.setState(state);
    this.updateTimer();
  }
  stopTimer() {
    let state = Array.prototype.slice.call(this.state);
    clearInterval(state.timerId);
    state.started = false;
    this.board.current.shuffleDeck();
    this.setState(state);
  }
  updateTimer() {
    this.state.timerId = setInterval( () => {
        let state = this.state;
        if (state.started) {
          state.timePassed = Date.now() - state.timeStarted;
          this.setState(state)
        }
      }, 180);
  }
  endGame(finished) {
    this.stopTimer();
    if (finished) {
      state.timeStarted = 0;
    }
  }
  render() {
    return(
      <div className={'game'}>
        <Board ref={this.board}
               active={this.state.started}
               onStart={()=>this.startTimer()}
               increment={()=>this.increment()}
               endGame={()=>this.endGame()} />
        <GameController active={this.state.started}
                        time={this.state.timePassed}
                        moves={this.state.moves}
                        onStop={()=>this.stopTimer()}
                        canSaveResult={this.state.canSaveResult} />
      </div>
    )
  }
}

const initGame = function(element) {
  ReactDOM.render(<Game />, element);
};

export {initGame};