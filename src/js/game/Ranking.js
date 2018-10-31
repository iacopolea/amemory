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
          <div key={i} className={'score'}>
            <b>{i}:</b>
            <span>Time: {this.props.ranking[i].time}</span>
            <span>Moves: {this.props.ranking[i].moves}</span>
            <span>Name: {this.props.ranking[i].userName}</span>
          </div>
        )
      }
    }
    return scores;
  }
  render() {
    return (
      <div className={'ranking'}>
        {this.renderScores()}
      </div>
    )
  }
}