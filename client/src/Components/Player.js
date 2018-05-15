import React, { Component } from 'react';
import Youtube from 'react-youtube';
import {RaisedButton} from 'material-ui';
import ('./../App.css');

class Player extends Component{
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
          />
        <br/>
        <RaisedButton label="Next Song" onClick={this.props.handleNext}/>
      </div>
    );
  }
}

export default Player;
