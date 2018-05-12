import React, {Component} from 'react';
import { Form, ButtonToolbar, Col, ControlLabel, Checkbox, FormGroup, FormControl, Button } from 'react-bootstrap';

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
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.callLoginApi = this.callLoginApi.bind(this);
    this.callRegisterApi = this.callRegisterApi.bind(this);
  }

  //TODO Form validation
  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleLoginSubmit(e){
    e.preventDefault();
    this.callLoginApi()
        .then(res=>{
          console.log(res.success);
          if(res.success) this.props.loginHandler(this.state.username);
          else {
            console.log("incorrect username or password");
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
          else console.log("Username is taken");
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
    const errors = this.validate(this.state.username, this.state.password);
    const centreStyled = { maxWidth: 400, margin: '0 auto 10px' }
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    const showError = (field) =>{
      const hasError = errors[field];
      const shouldShow = this.state.touched[field];
      return hasError ? shouldShow: false;
    }
    return (
      <div className="login" style={centreStyled}>
        <h2> Login as a Host </h2>
        <Form horizontal>
          <FormGroup controlId="formHorizontalUsername" >
            <Col sm={12}>
              <FormControl
                className ={showError('username') ? "error":""}
                bsSize="small"
                type="text"
                placeholder="Username..."
                value={this.state.username}
                name = "username"
                onChange={this.handleChange}
                onSubmit={this.handleLoginSubmit}
                onBlur={this.handleBlur('username')} 
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword" validationState={this.getValidationState(this.state.password.length)}>
            <Col sm={12}>
              <FormControl 
                className ={showError('password') ? "error":""}
                bsSize="small"
                type="password"
                placeholder="Password..."
                value={this.state.password}
                name = "password"
                onChange={this.handleChange}
                onSubmit={this.handleLoginSubmit}
                onBlur={this.handleBlur('password')}
              />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={3} sm={12}>
                <ButtonToolbar>
                    <Button type="submit" bsStyle="primary" bsSize="large" disabled={isDisabled} onClick={this.handleLoginSubmit}>Sign in</Button>
                    <Button type="submit" bsSize="large" disabled={isDisabled} onClick={this.handleRegisterSubmit}>Register</Button>
                </ButtonToolbar>
            </Col>
          </FormGroup>
        </Form>;
      </div>
    );
  }
}

export default Login;
