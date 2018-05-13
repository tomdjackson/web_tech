import React, { Component } from 'react';
import Youtube from 'react-youtube';

class Player extends Component{

  UNSAFE_componentWillMount(){
    console.log(this.props);
  }

  onReady(event){
    event.target.pauseVideo();
  }

  render(){
    var playerOpts = {
      height: '390',
      width: '640',
      playerVars:{
        autoplay:1
      }
    }
    return (
      <div className="Player">
        <Youtube
          videoId={this.props.song.key}
          opts={playerOpts}
          onEnd={this.props.handleNext}
          onReady={this.onReady}
        />
      </div>
    );
  }
}

export default Player;
