import React, {Component} from 'react';

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

  handleUpvoteSubmit(value){
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
      body: JSON.stringify({key: this.state.id})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }
  callDownvoteAPI = async () => {
    const response = await fetch('/api/downvote', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({key: this.state.id})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }


  render() {
    //TODO change button depending on its state
    return(
      <div className="Suggestion" key={this.props.song.key}>
        {this.props.song.votes}
        {this.props.song.title}
        <button onClick={this.handleUpvoteSubmit}>Upvote</button>
        <button onClick={this.handleDownvoteSubmit}>Downvote</button>
      </div>
    );
  }
}

export default Suggestions;
