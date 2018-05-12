import React, {Component} from 'react';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      touched: {
        username: false,
        password: false
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.callAPI = this.callAPI.bind(this);
  }

  //TODO Form validation
  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  callAPI = async () => {

  }

  handleSubmit(e){
    e.preventDefault();
    //TODO handle Auth
    this.props.loginHandler();
  }

  handleBlur = (field) => (evt) => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    });
  }

  validate(username, password){
    return{
      username: username.length < 1,
      password: password.length < 8
    };
  }

  render() {
    const errors = this.validate(this.state.username, this.state.password);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    const showError = (field) =>{
      const hasError = errors[field];
      const shouldShow = this.state.touched[field];
      return hasError ? shouldShow: false;
    }

    return (
      <div className="login">
        <h2> Login as a Host </h2>
        <form>
          <input
            className ={showError('username') ? "error":""}
            type="text"
            placeholder="Username..."
            value={this.state.username}
            name = "username"
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            onBlur={this.handleBlur('username')}
            />
          <br/>
          <input
            className ={showError('password') ? "error":""}
            type="password"
            placeholder="Password..."
            value={this.state.password}
            name = "password"
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            onBlur={this.handleBlur('password')}
            />
          <br/>
          <button disabled={isDisabled} onClick={this.handleSubmit}> Login </button>
          <button disabled={isDisabled} onClick={this.handleSubmit}> Register </button>
        </form>
      </div>
    );
  }
}

export default Login;
