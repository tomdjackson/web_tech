import React, {Component} from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class SelectRoom extends Component{
  constructor(props){
    super(props);
    this.state = {
      value: 0,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, i, v){
    this.setState({value: v});
    this.props.handler(v);
  }

  render(){
    return(
      <div>
      <form>
        <label style={{marginLeft: -140,}}>
          Select a Room: <br/>
          <DropDownMenu
            value={this.state.value}
            onChange={this.handleChange}
            style = {{width: 303, marginLeft: -122}}
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
