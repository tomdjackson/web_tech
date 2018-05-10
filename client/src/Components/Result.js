import React, {Component} from 'react';

class Result extends Component{
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(){
    //add song to suggesitons db
    fetch('/api/addsong', {
      method: "POST",
      body: { id: this.props.result.id,
              body: this.props.result,
              playlist: this.props.room
            }
    }).then(function(response){
      return response.json();
    }).then(function(json){
      console.log(json);
    }).catch(function(err){
      console.error(err.message);
    });
    this.props.handler();
  }

  render(){
    return (
      <div className="Result" key={this.props.result.id}>
      <img src={this.props.result.thumbnails.default.url} alt={this.props.result.id} className="thumb" height="40" width="40"/>
        <h4>{this.props.result.title}</h4>
        <p1>{this.props.result.description}</p1>
        <br/>
        <button onClick={this.handleSubmit}>Suggest</button>
      </div>
    )
  }
}

export default Result;
