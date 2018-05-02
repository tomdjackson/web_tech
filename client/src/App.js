import React, { Component } from 'react';
import logo from './logo.svg'; //TODO make a new logo
import './App.css';

class App extends Component {
  state = {
    searchText: '',
    searchResults: [],
    response: ''
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  getResults(){
    // youtubeSearch
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Democratic Playlists</h1>
        </header>
        <p className="App-intro">
          {this.state.response}
        </p>
      </div>
    );
  }
}

export default App;
