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
    const songs = this.props.songs.map(r => (
      <ListItem disabled={true} key={r.key}>
        <div className="Voting">
          <IconButton key={"upvote"+r.key} className="VoteButton" tooltip="Upvote" onClick={() => this.handleUpvoteSubmit(r.key)}>
            <img src={upvote} alt='upvote' className="upvote"/>
          </IconButton>
          <p className="Votes">{r.votes}</p>
          <IconButton key={"downvote"+r.key} className="VoteButton" tooltip="Downvote" onClick={() => this.handleDownvoteSubmit(r.key)}>
            <img src={downvote} alt='downvote' className="downvote"/>
          </IconButton>
        </div>
        <div className= "SongInfo">
          <div className="Thumb">
            <img src={r.thumbnail} alt={r.key}/>
          </div>
          <div className="SongTitle">
            <p>{r.title}</p>
          </div>
        </div>
      </ListItem>
    ))
    //TODO change button depending on its state
    return(
      <Paper zDepth={1}>
        Suggestions
        <List>
          {songs}
        </List>
      </Paper>
    );
  }
}

export default Suggestions;
