import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
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
    this.handleHostSubmit = this.handleHostSubmit.bind(this);
    this.handleGuestSubmit = this.handleGuestSubmit.bind(this);
    this.handleReturnHome = this.handleReturnHome.bind(this);
  }

  handleHostSubmit(e){
    this.setState({isHost: true});
  }

  handleGuestSubmit(e){
    this.setState({isGuest: true});
  }

  handleReturnHome() {
    this.setState({isHost: false, isGuest:false});
  }

  render() {
    var component = <p>failed.</p>;
    if (!this.state.isHost && !this.state.isGuest){
      component = (
        <div className="Well">
            <h3>I am a...</h3>
            <RaisedButton label="Host" secondary={true} onClick={this.handleHostSubmit}/>
            <RaisedButton label="Guest" className="GuestButton" onClick={this.handleGuestSubmit}/>
        </div>
      );
    }
    else if(this.state.isGuest) component = <Guest handler={this.handleReturnHome}/>
    else if (this.state.isHost) component = <Host handler={this.handleReturnHome}/>;
    return (
      <MuiThemeProvider>
      <div className="App">
          <header className="App-header">
              <img src={boogie} className="App-logo" alt="boogie" />
              <img src={ballot} className="App-logo" alt="ballot" />
          </header>
          {component}
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
