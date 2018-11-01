import React from "react";
import ReactDOM from "react-dom";
import GameController from './GameController';
import Board from './Board';
import Ranking from './Ranking';
import {firebase, db} from '../_firebase';

class Game extends React.Component {
  constructor() {
    super();
    this.board = React.createRef();
    const user = firebase.auth().currentUser;
    this.state = {
      timerId: false,
      started: false,
      timeStarted: 0,
      timePassed: 0,
      moves:0,
      canSaveResult: false,
      user: user,
      ranking: []
    };
    this.getScores();
    this.listenToLogin();
    this.startTimer = this.startTimer.bind(this);
    this.increment = this.increment.bind(this);
    this.endGame = this.endGame.bind(this);
    this.muteVolume = this.muteVolume.bind(this);
  }
  getScores() {
    db.collection("scores").orderBy("time").limit(10)
      .get()
      .then((querySnapshot) => {
        let scores = [];
        querySnapshot.forEach(function(doc) {
          scores.push(doc.data());
        });
        this.setState({ranking: scores})
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }
  listenToLogin() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({user: user})
    });
  }
  writeNewScore() {
    const user = this.state.user;
    const scoreData = {
      userId: user.uid,
      userName: user.displayName,
      timestamp: Date.now(),
      time: this.state.timePassed,
      moves: this.state.moves
    };
    let batch = db.batch();
    let usrRef = db.collection('users').doc(user.uid);
    let scoreRef = db.collection('scores').doc();
    const scoreId = scoreRef.id;
    batch.set(usrRef, {scores: {[scoreId]: scoreData}}, {merge: true});
    batch.set(scoreRef, scoreData);

    batch.commit().then(() => {
      this.setState({canSaveResult: false});
    }).catch((err) => {
      console.error(err);
      return false;
    });
  }
  increment() {
    this.state.moves++;
  }
  startTimer(e, callback) {
    let state = this.state;
    state.started = true;
    state.moves = 0;
    state.timeStarted = Date.now();
    this.setState(state);
    this.updateTimer();
    if (callback) {
      callback()
    };
  }
  muteVolume(vol) {
    this.board.current.setVolumes(vol);
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
  endGame() {
    this.stopTimer();
    this.setState({canSaveResult: true});
  }
  render() {
    return(
      <div className={'game'}>
        <Board ref={this.board}
               active={this.state.started}
               onStart={this.startTimer}
               increment={this.increment}
               endGame={this.endGame} />
        <GameController active={this.state.started}
                        time={this.state.timePassed}
                        moves={this.state.moves}
                        user={this.state.user}
                        onStop={()=>this.stopTimer()}
                        onSave={()=>this.writeNewScore()}
                        onMute={this.muteVolume}
                        canSaveResult={this.state.canSaveResult} />
        <Ranking ranking={this.state.ranking}/>
      </div>
    )
  }
}

const initGame = function(element) {
  ReactDOM.render(<Game />, element);
};

export {initGame};