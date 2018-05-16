import React, { Component } from 'react';
import Youtube from 'react-youtube';
import RaisedButton from 'material-ui/RaisedButton';
import ('./../App.css');

class Player extends Component{
    
  onReady(event){
      event.target.playVideo();
  }    
  render(){
    var playerOpts = {
      height:'360',
      width: '640',
      playerVars:{
        autoplay:1
      }
    }
    return (
      <div>
        <Youtube
          videoId={this.props.song.id}
          opts={playerOpts}
          onEnd={this.props.handleNext}
          onReady={this.onReady}
          />
        <br/>
        <RaisedButton label="Next Song" onClick={this.props.handleNext}/>
      </div>
    );
  }
}

export default Player;
