import React from "react";
import moment from 'moment';

export default class Ranking extends React.Component {
  constructor(props){
    super(props)
  }
  renderScores(){
    let scores = [];
    if (this.props.ranking.length > 0) {
      for (let i = 0; i < this.props.ranking.length; i++) {
        scores.push(
          <tr key={i} className={'score'}>
            <th><b>{i}</b></th>
            <td>{moment(this.props.ranking[i].time).format('mm:ss.S')}</td>
            <td>{this.props.ranking[i].moves}</td>
            <td>{this.props.ranking[i].userName}</td>
          </tr>
        )
      }
    }
    return scores;
  }
  render() {
    return (
      <div className={'ranking'}>
        <div className={'title'}>Classifica</div>
        <table className="table">
          <thead>
          <tr>
            <th></th>
            <th>Time</th>
            <th>Moves</th>
            <th>Name</th>
          </tr>
          </thead>
          <tbody>
          {this.renderScores()}
          </tbody>
        </table>
      </div>
    )
  }
}