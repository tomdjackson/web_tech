import React, { Component } from 'react';
import Results from './Results.js';
import './Results.css'
const youtubeSearch = require('youtube-search');

const opts = {
  maxResults: 7,
  key: 'AIzaSyCdK4Fco6BNjFa5XCpuBQUZdkxaudQLk48',
  typeID : '/m/04rlf',
  type: 'video'
};

class Search extends Component {
  constructor(){
    super();
    this.state = {
      results: [],
      hasSearch: false,
      search: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({search: e.target.value});
    this.setState({results:[], hasSearch:false});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({hasSearch:false});
    this.setState({search:e.target.value});
    if(this.state.search.length > 0) {
      youtubeSearch(this.state.search, opts, (err, res) => {
        //TODO render a loading animation for this?
        if(err) return console.log(err);
        this.setState({results: res});
      });
      this.setState({hasSearch:true});
    }
    else this.setState({hasSearch:false});
  }

  render() {
    var element = <p>No songs found.</p>;
    if(this.state.results.length>0) element = (<Results results = {this.state.results}/>)
    else if(!this.state.hasSearch) element = (<p></p>)
    return (
      <div className="Search">
        <form>
        <input
          type="text"
          onKeyPress={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              this.handleSubmit(e);
          }}}
          placeholder="Make a Suggestion...."
          value ={this.state.search}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        />
        <button onClick={this.handleSubmit}> Search </button>
        </form>
        <div className="search-results">
          {element}
        </div>
      </div>
    );
  }
}

export default Search;
