import React, {Component} from 'react';
import "./../css/Results.css"
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import './../css/Results.css'

class Result extends Component{
  constructor(){
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = function(r){
    //add song to suggesitons db
    fetch('/api/addsong', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        key: r.id+this.props.room+this.props.code,
        id: r.id,
        title: r.title,
        link: r.link,
        thumbnail: r.thumbnails.default.url,
        playlist: this.props.room+this.props.code
      })
    }).then(function(response){
      return response.json();
    }).then(function(res){
    }).catch(function(err){
      console.error(err.message);
    });
    this.props.handler();
  }

  render(){
    const options = this.props.results.map(r => (
      <Item key={r.id} r={r} handler={this.handleSubmit}/>
    ));
    return (
      <Paper
        style={{
          maxHeight: 200,
          width: '80%',
          overflow: 'auto',
          margin: 20,
          textAlign: 'center',
          display: 'inline-block'
        }}
        zDepth={3}
      >
        <h4>Search Results</h4>
        <List style={{maxHeight: '80%', overflow: 'auto'}}>
          {options}
        </List>
      </Paper>
    );
  }
}

class Item extends Component {
  handleClick = () => {
    this.props.handler(this.props.r);
  }

  render() {
    return (
      <ListItem key={"result" + this.props.r.key} onClick={this.handleClick}>
        <img src={this.props.r.thumbnails.default.url} alt={this.props.r.key} className="thumb" height="40" width="40"/>
        <h4>{this.props.r.title}</h4>
        <p>{this.props.r.description}</p>
        <br/>
      </ListItem>
    )
  }
}

export default Result;
