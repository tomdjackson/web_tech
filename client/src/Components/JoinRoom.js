import React, {Component} from 'react';
import { RaisedButton, TextField} from 'material-ui';
import ActionHome from 'material-ui/svg-icons/action/home';

class JoinRoom extends Component {
  constructor(props){
    super(props);
    this.state = {
      code: '',
      name: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.callAPI = this.callAPI.bind(this);
  }

  //TODO Form validation
  handleChange(e) {
    this.setState({[e.target.name]: e.target.value.toUpperCase()});
  }

  callAPI = async () => {
    const response = await fetch('/api/checkparty', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({code: this.state.code})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  handleSubmit(e){
    e.preventDefault();
    if(this.state.code.length === 5 && this.state.name.length > 0){
      this.callAPI()
          .then(res=> {
            if(res.exists){
              this.props.loginHandler(this.state.code, this.state.name);
            }
            else {
              console.log("Party doesn't exist.");
              this.setState({code: ''});
            }
          }).catch(err => console.log(err));
    }
  }

  render() {
    const style = {margin: 12};
    return (
      <div className="joinRoom">
        <h2> Join a Party </h2>
        <form>
          <TextField
            type="text"
            hintText="Unique Party Code"
            floatingLabelText="Enter a Code"
            name="code"
            maxLength = "5"
            value ={this.state.code}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
          />
          <br/>
          <TextField
            type="text"
            hintText="Name"
            floatingLabelText="Enter Your Name"
            maxLength = "10"
            name="name"
            value ={this.state.name}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
          />
          <br/>
          <RaisedButton icon={< ActionHome/>} style={style} onClick={this.props.handler} />
          <RaisedButton label="Join" style={style} onClick={this.handleSubmit}/> 
        </form>
      </div>
    );
  }
}

export default JoinRoom;
