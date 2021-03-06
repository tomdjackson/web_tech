import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ActionHome from 'material-ui/svg-icons/action/home';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Login from './Login.js';
import Player from './Player.js';
import Suggestion from './Suggestions.js';
import Search from './Search.js';
import SelectRoom from './SelectRoom.js';
import './../css/Host.css';

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
      rooms: [],
      errorTextCreate: '',
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
    this.handler = this.handler.bind(this);
    this.reset = this.reset.bind(this);
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
      res.rooms.forEach((room) =>{
        roomArray.push(room.name);
      });
      this.setState({rooms: roomArray});
    })
    .catch(err => console.log(err));
  }

  reset = async () => {
    var room = this.state.room;
    this.setState({room: ''});
    await fetch('/api/resetplayed', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({playlist: room+this.state.code})
    }).then(res=>{this.setState({room: room})
    }).catch(err => console.log(err));
    this.getSongs();
  }

  getSongs(){
    if(this.state.room === ''){
      setTimeout(this.getSongs, 50);
      return;
    }
    this.setState({song: ''});
    this.callSongsApi()
    .then(res=>{
      this.setState({songs:res.songs})
      for(var i=0; i < res.songs.length; i++){
        if(res.songs[i].played===0){
          this.setState({song: this.state.songs[i]});
          break;
        }
      }
      if(this.state.song === ''){
        this.reset();
        return;
      }
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
    if (this.state.errorTextCreate !== '') {
        this.setState({errorTextCreate: ''});
    }
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
      else {
        this.setState({errorTextCreate: 'Room already Exists'});
      }
    }
    else {
        this.setState({errorTextCreate: 'No Input'});
    }
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
        }
      ]
    })
  }

  delete(){
    var newRoomArray = this.state.rooms;
    if(this.state.value>0){
      this.deletePlaylistApi()
      .then(res=>{})
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
    const response = await fetch('/api/played', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({key: this.state.song.key})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  handleNext(){
    this.callPlayedSong()
    .then(res=> {})
    .catch(err=>console.log(err));
    this.setState({song: ''});
    this.getSongs();
  }

  handler(){
    this.setState(this.state);
  }

  render(){
    const styles = {
        underlineStyle: {
          borderColor: '#673AB7',
        },
        floatingLabelFocusStyle: {
          color: '#673AB7',
        },
    }
    var songs = '', player = '', search = '', deletebutton='';
    if(this.state.room!==''){
      songs = <Suggestion songs={this.state.songs} room={this.state.room} code={this.state.code} handler={this.updateSong}/>
      if(this.state.song!=='') player = <Player song={this.state.song} handleNext={this.handleNext}/>
      search = <Search room={this.state.room} code={this.state.code}/>
      deletebutton = <RaisedButton label="Delete Room" className="DeleteButton" onClick={this.handleDeleteSubmit}/>
    }
    var component = this.state.isLoggedIn ? (
      <div>
        <RaisedButton icon={< ActionHome/>} className='HomeButton' onClick={this.props.handler} />
        <h3> Your unique party code is: </h3>
        <h2> {this.state.code} </h2>
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
            errorText = {this.state.errorTextCreate}
            value={this.state.newRoom}
            onChange={this.handleCreateChange}
            onSubmit={this.handleCreateSubmit}
            underlineFocusStyle = {styles.underlineStyle}
            floatingLabelFocusStyle = {styles.floatingLabelFocusStyle}
            />
            <RaisedButton label="Create" secondary={true} className='CreateButton' onClick={this.handleCreateSubmit}/>
            <br/>
          </label>
        </form>
        <div className="RoomSelect">
          <SelectRoom className="SelectRoom" rooms={this.state.rooms} handler = {this.handleDeleteChange}/>
          {deletebutton}
        </div>
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
