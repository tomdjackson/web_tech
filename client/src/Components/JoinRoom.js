import React, {Component} from 'react';

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
    return (
      <div className="login">
        <h2> Join a Party </h2>
        <form>
          <input
            type="text"
            placeholder="Unique Party Code..."
            value={this.state.code}
            maxLength="5"
            name = "code"
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            />
          <br/>
          <input
            type="text"
            placeholder="Name..."
            value={this.state.name}
            maxLength = "10"
            name = "name"
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            />
          <br/>
          <button onClick={this.handleSubmit}> Join </button>
        </form>
      </div>
    );
  }
}

export default JoinRoom;
