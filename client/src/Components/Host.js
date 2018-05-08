import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class Host extends Component{
  constructor(){
    super();
    this.state = {
      value: 0,
      code: '',
      currentRoom: '',
      newRoom: '',
      rooms: []
    }
    this.handleCreateChange = this.handleCreateChange.bind(this);
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
    this.handleDeleteChange = this.handleDeleteChange.bind(this);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
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
        this.setState({currentRoom: this.state.newRoom, rooms: newRoomArray, newRoom: ''});
      }
      else console.log("room already exists");
    }
    else console.log("no input");
  }

  handleDeleteSubmit(e){
    e.preventDefault();
    var newRoomArray = this.state.rooms;
    if(this.state.value>0){
      newRoomArray.splice(this.state.value-1, 1);
    }
    this.setState({rooms: newRoomArray, value:0});
  }

  render(){
    return (
      <div className='Host'>
      <h3> Your unique party code is: </h3> <br/>
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
      )
    }
  }
  export default Host;
