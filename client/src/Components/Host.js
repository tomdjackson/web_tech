import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Login from './Login.js'

class Host extends Component{
  constructor(){
    super();
    this.state = {
      isLoggedIn: false,
      username: '',
      value: 0,
      code: '',
      newRoom: '',
      rooms: []
    }
    this.handleCreateChange = this.handleCreateChange.bind(this);
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
    this.handleDeleteChange = this.handleDeleteChange.bind(this);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
    this.loginHandler = this.loginHandler.bind(this);
    this.callPartyApi = this.callPartyApi.bind(this);
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
      body: ({username: this.state.username})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  callPlaylistAPI= async () => {
    const response = await fetch('/api/createplaylist', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({name: this.state.newRoom, code: this.state.code, username: this.state.username})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  handleCreateChange(e){
    this.setState({newRoom: e.target.value.toLowerCase()});
  }

  handleDeleteChange(e, i, v){
    this.setState({value: v});
  }

  handleCreateSubmit(e){
    e.preventDefault();
    this.setState({newRoom: e.target.value.toLowerCase()});
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
      body: JSON.stringify({name: room})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  handleDeleteSubmit(e){
    e.preventDefault();
    var newRoomArray = this.state.rooms;
    if(this.state.value>0){
      this.deletePlaylistApi()
          .then(res=>console.log(res.message))
          .catch(err=>console.log(err));
      var i = this.state.value - 1;
      newRoomArray.splice(i, 1);
      this.setState({value: 0, rooms: newRoomArray});
    }

  }

  loginHandler(username){
    this.setState({isLoggedIn: true, username: username});
    this.getCode();
  }


  render(){
    var component = this.state.isLoggedIn ? (
      <div>
      <h3> Your unique party code is: </h3>
      <h2> {this.state.code} </h2>
      <br/>
      <form>
      <label>
      Create a Room: <br/>
      <input
      type="text"
      onKeyPress={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleCreateSubmit(e);
        }}}
        placeholder="Room Name..."
        value={this.state.newRoom}
        onChange={this.handleCreateChange}
        onSubmit={this.handleCreateSubmit}
      />
      <button onClick={this.handleCreateSubmit}>Create</button>

      <br/>
      </label>
      </form>
      <form>
      <label>
      Delete a Room: <br/>
      <DropDownMenu
        value={this.state.value}
        onChange={this.handleDeleteChange}
      >
        <MenuItem value={0} primaryText ="Select"/>
        {this.state.rooms.map((room, index) =>
          <MenuItem key={index+1} value={index+1} primaryText={room}/>
        )}
      </DropDownMenu>
      <button onClick={this.handleDeleteSubmit}>Delete</button>
      </label>
      </form>
      </div>
    ) : (<Login loginHandler = {this.loginHandler}/>);
    return (
      <div className='Host'>
        {component}
      </div>
      )
    }
  }
  export default Host;
