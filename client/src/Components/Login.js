import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ActionHome from 'material-ui/svg-icons/action/home';
import './../css/Host.css'

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      errorTextPassword: '',
      errorTextUsername: '',
      touched: {
        username: false,
        password: false,
      }
    };
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.callLoginApi = this.callLoginApi.bind(this);
    this.callRegisterApi = this.callRegisterApi.bind(this);
  }

  //TODO Form validation
  handleChangeUsername(e) {
    this.setState({[e.target.name]: e.target.value});
    if (this.state.errorTextUsername !== '') {
        this.setState({errorTextUsername: ''});
    }
  }

  handleChangePassword(e) {
      this.setState({[e.target.name]: e.target.value});
      if (this.state.password.length < 7) {
          this.setState({errorTextPassword: 'Password too Short'});
      }
      else this.setState({errorTextPassword: ''});
  }

  handleLoginSubmit(e){
    e.preventDefault();
    this.callLoginApi()
        .then(res=>{
          if(res.success) this.props.loginHandler(this.state.username);
          else {
            this.setState({errorTextPassword: 'Username or Password Incorrect'});
            this.setState(({password: ''}));
          }
        })
        .catch(err => console.log(err));
  }

  callLoginApi = async () => {
    const response = await fetch('/api/login', {
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username: this.state.username, password: this.state.password})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  handleRegisterSubmit(e){
    e.preventDefault();
    this.callRegisterApi()
        .then(res=>{
          if(res.success) this.props.loginHandler(this.state.username);
          this.setState({errorTextUsername: 'Username is Taken'});
        })
        .catch(err => console.log(err));
  }

  callRegisterApi = async () => {
    const response = await fetch('/api/register', {
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username: this.state.username, password: this.state.password})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
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

  getValidationState(l) {
    if (l > 7) return 'success';
    else if (l > 0) return 'error';
    return null;
  }

  render() {
    const styles = {
        underlineStyle: {
          borderColor: '#673AB7',
        },
        floatingLabelFocusStyle: {
          color: '#673AB7',
        },
    }
    const errors = this.validate(this.state.username, this.state.password);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    return (
      <div className="Login">
        <RaisedButton icon={<ActionHome/>} className='HomeButton' onClick={this.props.handler} /><br/>
        <h2> Login as a Host </h2>
        <TextField
                type="text"
                hintText="Username"
                floatingLabelText="Username"
                value={this.state.username}
                errorText={this.state.errorTextUsername}
                name = "username"
                underlineFocusStyle = {styles.underlineStyle}
                floatingLabelFocusStyle = {styles.floatingLabelFocusStyle}
                onChange={this.handleChangeUsername}
                onSubmit={this.handleLoginSubmit}
                onBlur={this.handleBlur('username')}
        /><br />
        <TextField
                hintText="Password"
                floatingLabelText="Password"
                type="password"
                errorText={this.state.errorTextPassword}
                onKeyPress={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      this.handleLoginSubmit(e);
                    }}}
                value={this.state.password}
                name = "password"
                underlineFocusStyle = {styles.underlineStyle}
                floatingLabelFocusStyle = {styles.floatingLabelFocusStyle}
                onChange={this.handleChangePassword}
                onSubmit={this.handleLoginSubmit}
                onBlur={this.handleBlur('password')}
        /><br />
        <RaisedButton label="Sign In" secondary={true} className ={'LoginButton'} disabled={isDisabled} onClick={this.handleLoginSubmit}/>
        <RaisedButton label="Register" className ={'RegisterButton'} disabled={isDisabled} onClick={this.handleRegisterSubmit}/>
      </div>
    );
  }
}

export default Login;
