import React, { Component } from 'react';
import Search from './Search.js';
import JoinRoom from './JoinRoom.js';
import Suggestion from './Suggestions.js';
import SelectRoom from './SelectRoom.js';
import ActionHome from 'material-ui/svg-icons/action/home';
import { RaisedButton } from 'material-ui';

class Guest extends Component{
  constructor(){
    super();
    this.state = {
      code: '',
      room:'',
      rooms: [],
      songs: [],
      username: '',
      isLoggedIn: false,
    }
    this.loginHandler = this.loginHandler.bind(this);
    this.roomSelectHandler = this.roomSelectHandler.bind(this);
    this.getSongs = this.getSongs.bind(this);
    this.suggestHandler = this.suggestHandler.bind(this);
  }

  getRooms(){
    this.callApi()
    .then(res=>{
      var roomArray = [];
      res.rooms.forEach((room) =>{
        roomArray.push(room.name);
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

  roomSelectHandler(v){
    if(v>0){
      this.setState({room: this.state.rooms[v-1]});
      this.getSongs();
    }
    else this.setState({room: ''});
  }

  getSongs(){
    if(this.state.room === ''){
      setTimeout(this.getSongs, 50);
      return;
    }
    this.callSongsApi()
        .then(res=>{this.setState({songs:res.songs})})
        .catch(err => console.log(err));
  }

  callSongsApi = async () =>{
    const response = await fetch('/api/getsongs', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({playlist: this.state.room+this.state.code})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  suggestHandler(){
    this.setState(this.state);
  }

  render(){
    var welcome = (<h3>Hello {this.state.username}. Welcome to {this.state.code} </h3>);
    var component = (
            <div>
              {welcome}
              <br/>
              <RaisedButton icon={< ActionHome/>} onClick={this.props.handler} />
              <br/>
              <SelectRoom rooms={this.state.rooms} handler = {this.roomSelectHandler}/>
            </div>
          );
    if(this.state.isLoggedIn){
      if(this.state.room !== ''){
        component = (
          <div>
            {welcome}
            <br/>
            <RaisedButton icon={<ActionHome/>} onClick={this.props.handler} />
            <br/>
            <SelectRoom rooms={this.state.rooms} handler = {this.roomSelectHandler}/>
            <br/>
            <Search room={this.state.room} code={this.state.code}/>
            <br/>
            <Suggestion songs={this.state.songs} room={this.state.room} code={this.state.code} handler={this.suggestHandler}/>
          </div>
        );
      }
    }
    else component = (<JoinRoom handler={this.props.handler} loginHandler={this.loginHandler}/>);
    return (
      <div className='Guest'>
        {component}
      </div>
    )
  }
}
export default Guest;
