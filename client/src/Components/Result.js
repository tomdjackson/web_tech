import React, {Component} from 'react';
import "./Results.css"

class Result extends Component{
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(){
    //add song to suggesitons db
    fetch('/api/addsong', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id: this.props.result.id,
              title: this.props.result.title,
              link: this.props.result.link,
              thumbnail: this.props.result.thumbnails.default.url,
              playlist: this.props.room
            })
    }).then(function(response){
      return response.json();
    }).then(function(res){
      console.log(res.message);
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
        <p>{this.props.result.description}</p>
        <br/>
        <button onClick={this.handleSubmit}>Suggest</button>
      </div>
    )
  }
}

export default Result;
