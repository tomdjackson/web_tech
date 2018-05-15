import React, { Component } from 'react';
import Result from './Result.js';
import './Results.css'
import {List, ListItem} from 'material-ui/List';
import {TextField, RaisedButton} from 'material-ui';
import Paper from 'material-ui/Paper';

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
    const style = {
      maxHeight: 200,
      width: '80%',
      overflow: 'auto',
      margin: 20,
      textAlign: 'center',
      display: 'inline-block'
    };
    const options = this.state.results.map(r => (
      <ListItem key={r.id}>
        <Result key={r.id} handler={this.handler} result={r} room={this.props.room}/>
      </ListItem>
    ));
    return (
        <Paper style={style} zDepth={1}>
          Search Results
          <List style={{maxHeight: '100%', overflow: 'auto'}}>
            {options}
          </List>
        </Paper>
    );
  }

  render() {
    const style = {margin: 12};
    var element = <p>No songs found.</p>;
      if(this.state.results.length>0) element = this.getResults();
      else if(!this.state.hasSearch) element = null;
      return (
        <div className="Search">
          <form>
            <label>
                <TextField
                  type="text"
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      this.handleSubmit(e);
                    }}}
                  hintText="Make a Suggestion"
                  floatingLabelText="Make a Suggestion"
                  value ={this.state.search}
                  onChange={this.handleChange}
                  onSubmit={this.handleSubmit}
                />

                <RaisedButton label="Search" secondary={true} style={style} onClick={this.handleSubmit}/>
            </label>
          </form>
          <div className="search-results">
            {element}
          </div>
        </div>
      );
  }
      
}

export default Search;
