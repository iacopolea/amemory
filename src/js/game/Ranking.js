import React from "react";

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
            <th><b>{i}:</b></th>
            <td>{this.props.ranking[i].time}</td>
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
        <table class="table">
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