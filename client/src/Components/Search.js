import React, { Component } from 'react';
import Result from './Result.js';
import './Results.css'
const youtubeSearch = require('youtube-search');

const opts = {
  maxResults: 7,
  key: 'AIzaSyCdK4Fco6BNjFa5XCpuBQUZdkxaudQLk48',
  typeID : '/m/04rlf',
  type: 'video'
};

class Search extends Component {
  constructor(props){
    super(props);
    this.state = {
      results: [],
      hasSearch: false,
      search: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handler = this.handler.bind(this);
    this.getResults = this.getResults.bind(this);
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

  handler(e){
    this.setState({search:'', results:[], hasSearch:false});
  }

  getResults(){
    const options = this.state.results.map(r => (
      <li>
        <Result key={r.id} handler={this.handler} result={r} room={this.props.room}/>
      </li>
    ));
    return <ul>{options}</ul>;
  }

    render() {
      var element = <p>No songs found.</p>;
        if(this.state.results.length>0) element = this.getResults();
        else if(!this.state.hasSearch) element = null;
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
