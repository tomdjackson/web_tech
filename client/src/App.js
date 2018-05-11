import React, { Component } from 'react';
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

  render() {
    var component = <p>failed.</p>;
    if (!this.state.isHost && !this.state.isGuest){
      component = (
        <div>
        <h3>I am a...</h3>
        <button name="isHost" onClick={this.handleSubmit}>Host</button>
        <button name="isGuest" onClick={this.handleSubmit}>Guest</button>
        </div>
      );
    }
    else if(this.state.isGuest) component = <Guest/>
    else if (this.state.isHost) component = <Host/>;
    return (
      <MuiThemeProvider>
      <div className="App">
      <header className="App-header">
      <img src={boogie} className="App-logo-boogie" alt="boogie" />
      <img src={logo} className="App-logo" alt="logo" />
      <img src={ballot} className="App-logo-ballot" alt="ballot" />
      </header>
      {component}
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
