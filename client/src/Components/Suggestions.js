import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import downvote from './../svg/arrow_downward.svg';
import upvote from './../svg/arrow_upward.svg';
import './../App.css'
import './Results.css'

class Suggestions extends Component{
  constructor(props){
    super(props);
    this.state = {
      id: this.props.song.key
    }
    this.handleUpvoteSubmit = this.handleUpvoteSubmit.bind(this);
    this.callUpvoteAPI = this.callUpvoteAPI.bind(this);
    this.handleDownvoteSubmit = this.handleDownvoteSubmit.bind(this);
    this.callDownvoteAPI = this.callDownvoteAPI.bind(this);
  }

  handleUpvoteSubmit(){
    this.callUpvoteAPI()
        .then(res=> {
          console.log(res.message);
        }).catch(err => console.log(err));
  }
  handleDownvoteSubmit(){
    this.callDownvoteAPI()
        .then(res=> {
          console.log(res.message);
        }).catch(err => console.log(err));
  }

  callUpvoteAPI = async () => {
    const response = await fetch('/api/upvote', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({key: this.state.id, playlist: this.props.room})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }
  callDownvoteAPI = async () => {
    const response = await fetch('/api/downvote', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({key: this.state.id, playlist: this.props.room})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  render() {
    //TODO change button depending on its state
    return(
      <div className="Suggestion" key={this.props.song.key}>
        <div className="Voting">
        <IconButton tooltip="Font Icon" onClick={this.handleUpvoteSubmit}>
          <img src={upvote} className="upvote"/>
        </IconButton>
        {this.props.song.votes}
        <IconButton tooltip="Font Icon" onClick={this.handleDownvoteSubmit}>
          <img src={downvote} className="downvote"/>
        </IconButton>
        </div>
        <img src={this.props.song.thumbnail} alt={this.props.song.id} className="thumb"/>
        <br/>
        {this.props.song.title}
      </div>
    );
  }
}

export default Suggestions;
