import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import downvote from './../svg/arrow_downward.svg';
import upvote from './../svg/arrow_upward.svg';
import './../App.css'
import './Results.css'

class Suggestions extends Component{
  constructor(props){
    super(props);
    this.state = {
      id: ''
    };
    this.handleUpvoteSubmit = this.handleUpvoteSubmit.bind(this);
    this.callUpvoteAPI = this.callUpvoteAPI.bind(this);
    this.handleDownvoteSubmit = this.handleDownvoteSubmit.bind(this);
    this.callDownvoteAPI = this.callDownvoteAPI.bind(this);
  }

  handleUpvoteSubmit(e){
    this.setState({id: e.key});
    this.callUpvoteAPI()
    .then(res=> {
      console.log(res.message);
    }).catch(err => console.log(err));
    this.setState({id: ''});
  }
  handleDownvoteSubmit(e){
    this.setState({id: e.key});
    this.callDownvoteAPI()
    .then(res=> {
      console.log(res.message);
    }).catch(err => console.log(err));
    this.setState({id: ''});
  }

  callUpvoteAPI = async () => {
    console.log(this.state.id+this.props.room+this.props.code);
    const response = await fetch('/api/upvote', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({key: this.state.id+this.props.room+this.props.code})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }
  callDownvoteAPI = async () => {
    const response = await fetch('/api/downvote', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({key: this.state.id+this.props.room+this.props.code})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  render() {
    const style = {
      height: 200,
      width: '80%',
      overflow: 'auto',
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
    };
    const songs = this.props.songs.map(r => (
      <ListItem disabled={true}>
          <div className="Voting">
            <IconButton key={"suggestion"+r.key} className="VoteButton" tooltip="Font Icon" onClick={this.handleUpvoteSubmit}>
              <img src={upvote} alt='upvote' className="upvote"/>
            </IconButton>
            {r.votes}
            <IconButton key={r.key} className="VoteButton" tooltip="Font Icon" onClick={this.handleDownvoteSubmit}>
              <img src={downvote} alt='downvote' className="downvote"/>
            </IconButton>
          </div>
          <div className="SongInfo">
            <img src={r.thumbnail} alt={r.key} className="thumb"/>
            {r.title}
          </div>
      </ListItem>
    ))
    //TODO change button depending on its state
    return(
      <Paper style={style} zDepth={1}>
        Suggestions
        <List style={{maxHeight: '100%', overflow: 'auto'}}>
          {songs}
        </List>
      </Paper>
    );
  }
}

export default Suggestions;
