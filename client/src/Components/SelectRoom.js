import React, {Component} from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class SelectRoom extends Component{
  constructor(props){
    super(props);
    this.state = {
      rooms: this.props.rooms,
      value: 0,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, i, v){
    this.setState({value: v});
    if(v>0) {
      this.props.handler(v);
    }
  }

  render(){
    return(
      <div>
      <form>
        <label>
          Select a Room: <br/>
          <DropDownMenu
            value={this.state.value}
            onChange={this.handleChange}
          >
            <MenuItem value={0} primaryText ="Select"/>
            {this.props.rooms.map((room, index) =>
              <MenuItem key={index+1} value={index+1} primaryText={room}/>
            )}
          </DropDownMenu>
        </label>
      </form>
      </div>
    );
  }
}

export default SelectRoom;
