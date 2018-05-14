import React, { Component } from 'react';
import { Image, Button } from 'react-bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import logo from './logo.svg';
import boogie from './boogie.png';
import ballot from './ballot.png';
import Host from './Components/Host.js'
import Guest from './Components/Guest.js'
import ('./App.css');

class App extends Component {
  constructor(){
    super();
    this.state = {
      isHost: false,
      isGuest: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    this.setState({[e.target.name]: true});
  }

  //TODO make the logos responsive
  render() {
    var component = <p>failed.</p>;
    const centreStyled = { maxWidth: 400, margin: '0 auto 10px' };
    if (!this.state.isHost && !this.state.isGuest){
      component = (
        <div className="well" style={centreStyled}>
            <h3>I am a...</h3>
            <Button name="isHost" onClick={this.handleSubmit} bsStyle="primary" bsSize="large" block>Host</Button>
            <Button name="isGuest" onClick={this.handleSubmit} bsSize="large" block>Guest</Button>
        </div>
      );
    }
    else if(this.state.isGuest) component = <Guest/>
    else if (this.state.isHost) component = <Host/>;
    return (
      <MuiThemeProvider>
      <div className="App">
      <header className="App-header">
      <img src={boogie} className="App-logo-balls" alt="boogie" />
      <img src={logo} className="App-logo" alt="logo" />
      <img src={ballot} className="App-logo-balls" alt="ballot" />
      </header>
      {component}
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
