import React, { Component } from 'react';
import {TextField, RaisedButton} from 'material-ui';
import ActionHome from 'material-ui/svg-icons/action/home';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Login from './Login.js';
import Player from './Player.js';
import Suggestion from './Suggestions.js';
import Search from './Search.js';
import SelectRoom from './SelectRoom.js';
import './../App.css';

class Host extends Component{
  constructor(){
    super();
    this.state = {
      isLoggedIn: false,
      username: '',
      value: 0,
      code: '',
      newRoom: '',
      room: '',
      songs: [],
      song: '',
      rooms: []
    }
    this.handleCreateChange = this.handleCreateChange.bind(this);
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
    this.handleDeleteChange = this.handleDeleteChange.bind(this);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
    this.loginHandler = this.loginHandler.bind(this);
    this.getCode = this.getCode.bind(this);
    this.callPartyApi = this.callPartyApi.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
    this.handleNext = this.handleNext.bind(this);
    this.delete = this.delete.bind(this);
    this.getSongs = this.getSongs.bind(this);
    this.callSongsApi = this.callSongsApi.bind(this);
    this.getRooms = this.getRooms.bind(this);
  }

  componentWillUnmount(){
    if(this.timeout) clearTimeout(this.timeout)
  }

  getRooms(){
    if(this.state.code === ''){
      setTimeout(this.getRooms, 50);
      return;
    }
    this.callRoomsApi()
        .then(res=>{
          var roomArray = [];
          console.log(res.rooms)
          res.rooms.forEach((room) =>{
            roomArray.push(room.name);
          });
          this.setState({rooms: roomArray});
        })
        .catch(err => console.log(err));
  }

  getSongs(){
    if(this.state.room === ''){
      setTimeout(this.getSongs, 50);
      return;
    }
    this.callSongsApi()
        .then(res=>{
          this.setState({songs:res.songs})
          var index = 0;
          var empty = false;
          while(res.songs[index].played === 1 && !empty){
            index++;
            if(index>res.songs.length){
              empty = true;
              index = 0;
            }
          }
          this.setState({song: this.state.songs[index]});
        })
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

  callRoomsApi = async () => {
    const response = await fetch('/api/getplaylists', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({code: this.state.code})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  getCode(){
    this.callPartyApi()
        .then(res=>this.setState({code: res.code}))
        .catch(err => console.log(err));
  }

  callPartyApi = async () => {
    const response = await fetch('/api/createparty', {
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username: this.state.username})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  callPlaylistAPI= async () => {
    const response = await fetch('/api/createplaylist', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({key: this.state.newRoom+this.state.code, name: this.state.newRoom, code: this.state.code})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  handleCreateChange(e){
    this.setState({newRoom: e.target.value.toLowerCase()});
  }

  handleDeleteChange(v){
    this.setState({value: v, room: ''});
    if(v>0){
      this.setState({room: this.state.rooms[v-1]});
      this.getSongs();
    }
  }

  handleCreateSubmit(e){
    e.preventDefault();
    this.setState({newRoom: this.state.newRoom.toLowerCase()});
    if(this.state.newRoom.length > 0){
      if(!this.state.rooms.includes(this.state.newRoom)){
        var newRoomArray = this.state.rooms;
        newRoomArray.push(this.state.newRoom);
        this.callPlaylistAPI()
            .then(res=>console.log(res.message))
            .catch(err=>console.log(err));
        this.setState({newRoom: '', rooms: newRoomArray});
      }
      else console.log("room already exists");
    }
    else console.log("no input");
  }

  deletePlaylistApi = async () => {
    var i = this.state.value - 1;
    var room = this.state.rooms[i];
    const response = await fetch('/api/deleteplaylist', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({name: room+this.state.code})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  handleDeleteSubmit(e){
    e.preventDefault();
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete ' + this.state.room + '?',
      buttons:[
        {
          label: 'Delete',
          onClick: () => this.delete()
        },
        {
          label: 'Cancel',
          onClick: () => alert("Cancel")
        }
      ]
    })

  }

  delete(){
    var newRoomArray = this.state.rooms;
    if(this.state.value>0){
      this.deletePlaylistApi()
          .then(res=>console.log(res.message))
          .catch(err=>console.log(err));
      var i = this.state.value - 1;
      newRoomArray.splice(i, 1);
      this.setState({value: 0, rooms: newRoomArray, room: ''});
    }
  }

  loginHandler(username){
    this.setState({isLoggedIn: true, username: username});
    this.getCode();
    this.getRooms();
  }

  callPlayedSong = async () => {
    console.log(this.state.song.key);
    const response = await fetch('/api/played', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({code: this.state.song.key})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  handleNext(){
    this.callPlayedSong()
        .then(res=> { console.log(res.success) })
        .catch(err=>console.log(err));
    this.setState({song: ''});
    this.getSongs();
  }

  render(){
    var songs = '';
    var player = '';
    var search = '';
    const deleteStyle = {margin: 12, marginLeft: -20, height: 24, width: 24, padding: 20}
    const buttonStyle = {marginTop: 10, marginLeft: -7, display: 'inline-block'}
    const style = {margin: 12};
    if(this.state.room!==''){
      songs = <Suggestion songs={this.state.songs} room={this.state.room} code={this.state.code} handler={this.updateSong}/>
      if(this.state.song!=='') player = <Player song={this.state.song} handleNext={this.handleNext}/>
      search = <Search room={this.state.room} code={this.state.code}/>
    }
    var component = this.state.isLoggedIn ? (
      <div>
      <h3> Your unique party code is: </h3>
      <h2> {this.state.code} </h2>
      <RaisedButton style={style} icon={< ActionHome/>} onClick={this.props.handler} />
      <br/>
      <form>
          <label>
              Create a Room: <br/>
              <TextField
                type="text"
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleCreateSubmit(e);
                  }}}
                hintText="Room Name"
                floatingLabelText="Room Name"
                value={this.state.newRoom}
                onChange={this.handleCreateChange}
                onSubmit={this.handleCreateSubmit}
              />
              <RaisedButton label="Create" secondary={true} style={style} onClick={this.handleCreateSubmit}/>
              <br/>
          </label>
      </form>
      <SelectRoom rooms={this.state.rooms} handler = {this.handleDeleteChange} deleteRoomsHandler={this.handleDeleteSubmit}/>
      <RaisedButton label="Delete" style={deleteStyle, buttonStyle} onClick={this.props.deleteRoomsHandler}/>
      {search}
      {songs}
      {player}
      </div>
    ) : (<Login loginHandler = {this.loginHandler} handler={this.props.handler}/>)
    return (
      <div className='Host'>
        {component}
      </div>
      )
    }
  }
  export default Host;
