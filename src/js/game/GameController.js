import React from 'react';
import moment from 'moment';

export default class GameController extends React.Component {
  saveResults() {
    this.props.onSave();
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
          <span>{(this.props.user) ? this.props.user.displayName : ''}</span>
        </div>
      </div>
    )
  }
}