import React from 'react';
import moment from 'moment';

export default class GameController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      soundActive: false,
    }
    this.controlVolume = this.controlVolume.bind(this);
  }
  saveResults() {
    this.props.onSave();
  }
  controlVolume() {
    let soundActive = !this.state.soundActive;
    let newVolume = (soundActive) ? 0.3 : 0;
    this.setState({soundActive: soundActive});
    this.props.onMute(newVolume);
  }
  render() {
    return (
      <div className={'game-controller'}>
        <div className={'time'}>{moment(this.props.time).format('mm:ss.S')}</div>
        <div className={'moves'}>Moves: {this.props.moves}</div>
        <div className={'user-data'}>
          <span>{(this.props.user) ? `user: ${this.props.user.displayName }` : ''}</span>
        </div>
        <div className={'actions'}>
          <button className={'button stop'}
                  disabled={!this.props.active}
                  onClick={()=>this.props.onStop()}>Stop</button>
          <button className={'button save'}
                  disabled={!this.props.canSaveResult}
                  onClick={()=>{this.saveResults()}}>{(this.props.user) ? 'save' : 'only signed in user can save results'}</button>
          <button className={'button sounds'} onClick={this.controlVolume}>{(this.state.soundActive) ? 'mute' : 'activate sounds'}</button>
        </div>
      </div>
    )
  }
}