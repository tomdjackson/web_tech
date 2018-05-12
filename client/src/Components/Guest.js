import React, { Component } from 'react';
import Search from './Search.js';
import JoinRoom from './JoinRoom.js';
import Suggestion from './Suggestions.js';
import SelectRoom from './SelectRoom.js';

//TODO Add username into database
class Guest extends Component{
  constructor(){
    super();
    this.state = {
      code: '',
      room:'',
      rooms: [],
      songs: [],
      username: '',
      isLoggedIn: false
    }
    this.loginHandler = this.loginHandler.bind(this);
    this.roomSelectHandler = this.roomSelectHandler.bind(this);
  }

  getRooms(){
    this.callApi()
    .then(res=>{
      var roomArray = [];
      res.rooms.forEach((room) =>{
        roomArray.push(room.key);
      });
      this.setState({rooms: roomArray});
    })
    .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/getplaylists', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({code: this.state.code})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  loginHandler(party_code, name){
    this.setState({isLoggedIn: true, code: party_code, username: name});
    this.getRooms();
  }

  getSongs(){
    this.callSongsApi()
        .then(res=>{
          this.setState({songs: res.songs});
        })
        .catch(err => console.log(err));
  }

  callSongsApi = async () =>{
    const response = await fetch('/api/getsongs', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({playlist: this.state.room})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  roomSelectHandler(v){
    if(v>0){
      this.setState({room: this.state.rooms[v-1]});
    }
    else this.setState({room: '', songs: []});
  }

  getSuggestions(){
    //TODO work out a better place to put this function
    this.getSongs();
    const options = this.state.songs.map(r => (
      <li key={r.id}>
        <Suggestion song={r}/>
      </li>
    ));
    return <ul>{options}</ul>;
  }

  render(){
    var welcome = (<h3>Hello {this.state.username}. Welcome to {this.state.code} </h3>);
    var component = (
            <div>
              {welcome}
              <br/>
              <SelectRoom rooms={this.state.rooms} handler = {this.roomSelectHandler}/>
            </div>
          );
    if(this.state.isLoggedIn){
      if(this.state.room !== ''){
        var suggestions = this.getSuggestions();
        component = (
          <div>
            {welcome}
            <br/>
            <SelectRoom rooms={this.state.rooms} handler = {this.roomSelectHandler}/>
            <br/>
            <Search room={this.state.room}/>
            <br/>
            {suggestions}
          </div>
        );
      }
    }
    else component = (<JoinRoom loginHandler = {this.loginHandler}/>);
    return (
      <div className='Guest'>
        {component}
      </div>
    )
  }
}
export default Guest;
