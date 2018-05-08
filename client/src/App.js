import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import logo from './logo.svg'; //TODO make a new logo
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
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Boogie Ballot</h1>
      </header>
      {component}
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
