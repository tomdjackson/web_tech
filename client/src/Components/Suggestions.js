import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import downvote from './../svg/arrow_downward.svg';
import upvote from './../svg/arrow_upward.svg';
import './../App.css'
import './../css/Results.css'

class Suggestions extends Component{
  constructor(props){
    super(props);
    this.state = {
      key: ''
    };
    this.handleUpvoteSubmit = this.handleUpvoteSubmit.bind(this);
    this.callUpvoteAPI = this.callUpvoteAPI.bind(this);
    this.handleDownvoteSubmit = this.handleDownvoteSubmit.bind(this);
    this.callDownvoteAPI = this.callDownvoteAPI.bind(this);
  }

  componentWillUnmount(){
    if(this.timeout) clearTimeout(this.timeout)
  }

  handleUpvoteSubmit(key){
    this.callUpvoteAPI(key)
    .then(res=> {
    }).catch(err => console.log(err));
  }

  handleDownvoteSubmit(key){
    this.callDownvoteAPI(key)
    .then(res=> {
    }).catch(err => console.log(err));
  }

  callUpvoteAPI = async (key) => {
    const response = await fetch('/api/upvote', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({key: key})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  callDownvoteAPI = async (key) => {
    const response = await fetch('/api/downvote', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({key: key})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  render() {
    var songs = <p>No songs have been suggested yet. Make a suggestion!</p>
    if(this.props.songs.length>0){
      songs = this.props.songs.map((r) => {
        if(r.played === 0){ return (
          <Song key={r.key} r={r} handleUpvote={this.handleUpvoteSubmit} handleDownvote={this.handleDownvoteSubmit}/>
        )
      }
      else return null;
    })
  }

  return(
    <Paper
      style={{
        maxHeight: 200,
        width: '80%',
        overflow: 'auto',
        margin: 20,
        textAlign: 'center',
        display: 'inline-block'
      }}
      className="Suggestions" zDepth={1}
      >
      <h4>Suggestions</h4>
      <List style={{maxHeight: '80%', overflow: 'auto'}}>
        {songs}
      </List>
    </Paper>
  );
}
}

class Song extends Component {
  constructor(props){
    super(props);
    this.state = {
      upvoted: false,
      downvoted: false,
      votes: this.props.r.votes
    }
    this.handleUpvote = this.handleUpvote.bind(this);
    this.handleDownvote = this.handleDownvote.bind(this);
  }

  handleUpvote(){
    var votes = this.state.votes+1;
    if(this.state.downvoted){
      this.props.handleUpvote(this.props.r.key);
      this.setState({downvoted:false});
      votes++;
    }
    this.setState({upvoted: true, votes: votes})
    this.props.handleUpvote(this.props.r.key);
  }

  handleDownvote(){
    var votes= this.state.votes-1;
    if(this.state.upvoted){
      this.props.handleDownvote(this.props.r.key);
      this.setState({upvoted:false});
      votes--;
    }
    this.setState({downvoted: true, votes: votes})
    this.props.handleDownvote(this.props.r.key);
  }
  render(){

    return(
      <ListItem className="Suggestion" disabled={true} key={this.props.r.key}>
        <div className="Voting">
          <IconButton key={"upvote"+this.props.r.key} disabled={this.state.upvoted} className="VoteButton" tooltip="Upvote" onClick={this.handleUpvote}>
            <img src={upvote} alt='upvote' className="upvote"/>
          </IconButton>
          <p className="Votes">{this.state.votes}</p>
          <IconButton key={"downvote"+this.props.r.key} disabled={this.state.downvoted} className="VoteButton" tooltip="Downvote" onClick={this.handleDownvote}>
            <img src={downvote} alt='downvote' className="downvote"/>
          </IconButton>
        </div>
        <div className= "SongInfo">
          <div className="Thumb">
            <img src={this.props.r.thumbnail} alt={this.props.r.key}/>
          </div>
          <div className="SongTitle">
            <p>{this.props.r.title}</p>
          </div>
        </div>
      </ListItem>
    );
  }
}

export default Suggestions;
