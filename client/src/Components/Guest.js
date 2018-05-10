import React, { Component } from 'react';
import Search from './Search.js';
import Login from './Login.js';
import Suggestions from './Suggestions.js';
import SelectRoom from './SelectRoom.js';

class Guest extends Component{
  constructor(){
    super();
    this.state = {
      code: '',
      room:'',
      rooms: [],
      isLoggedIn: false
    }
    this.loginHandler = this.loginHandler.bind(this);
    this.handler = this.handler.bind(this);
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

  loginHandler(party_code){
    this.setState({isLoggedIn: true, code: party_code});
    this.getRooms();
  }

  handler(v){
    if(v>0) {
      this.setState({room: this.state.rooms[v-1]});
    }
  }

  render(){
    var component = (<SelectRoom rooms={this.state.rooms} handler = {this.handler}/>);
    if(this.state.isLoggedIn){
      if(this.state.room !== ''){
        component = (
        <div>
          <SelectRoom rooms={this.state.rooms} handler = {this.handler}/>
          <br/>
          <Search room={this.state.room}/>
          <br/>
          <Suggestions room={this.state.room}/>
        </div>
        )
      }
    }
    else component = (<Login loginHandler = {this.loginHandler}/>);
    return (
      <div className='Guest'>
        {component}
      </div>
    )
  }
}
export default Guest;
