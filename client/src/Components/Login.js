import React, {Component} from 'react';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      code: '',
      name: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  //TODO Form validation

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleSubmit = () => {
    // this.props.handler;
  }

  render() {
    return (
      <div className="login">
        <h2> Join a Party </h2>
        <form>
          <input
            type="text"
            onKeyPress={e => {
              if (e.key === 'Enter') {
                this.handleSubmit();
              }}}
            placeholder="Unique Party Code"
            maxLength="5"
            name = "code"
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
          />
          <br/>
          <input
            type="text"
            onKeyPress={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSubmit();
              }}}
            placeholder="Name"
            maxLength = "10"
            name = "name"
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
          />
          <br/>
          <button onClick={this.props.loginHandler}> Join </button>
        </form>
      </div>
    );
  }
}

export default Login;
