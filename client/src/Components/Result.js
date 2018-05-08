import React, {Component} from 'react';

class Result extends Component{
  constructor(props){
    super(props);
    this.state = {
      result: props.result,
    }
  }

  handleSubmit(){
    //add song to suggesitons db

  }

  render(){
    return (
      <div className="Result">
      <img src={this.state.result.thumbnails.default.url} alt={this.state.result.id} className="thumb" height="40" width="40"/>
        <h4>{this.state.result.title}</h4>
        <p1>{this.state.result.description}</p1>
        <br/>
        <button onClick={this.handleSubmit}>Suggest</button>
      </div>
    )
  }
}

export default Result;
