import React, { Component } from 'react';
import Result from './Result.js';
import './../css/Results.css'
import loading from './../svg/logo.svg';
import {TextField, RaisedButton} from 'material-ui';
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
      search: '',
      errorTextSearch: '',      
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handler = this.handler.bind(this);
  }

  componentWillUnmount(){
    if(this.timeout) clearTimeout(this.timeout)
  }

  handleChange(e) {
    this.setState({search: e.target.value});
    this.setState({results:[], hasSearch:false});
    
    if (this.state.errorTextSearch != '') {
        this.setState({errorTextSearch:''});
    }
  }

  handler(e){
    this.setState({search:'', results:[], hasSearch:false});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({hasSearch:false});
    this.setState({search:e.target.value});
    if(this.state.search.length > 0) {
      youtubeSearch(this.state.search, opts, (err, res) => {
        if(err) return console.log(err);
        this.setState({results: res});
      });
      this.setState({hasSearch:true});
    }
    else {
      this.setState({hasSearch:false});
      this.setState({errorTextSearch:'Enter a Song Name'});
    }
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
    var element = null;
      if(this.state.results.length>0) element = <Result handler={this.handler} results={this.state.results} room={this.props.room} code={this.props.code}/>
      if(this.state.search.length>0 && !this.state.hasSearch) element = element = <img alt="loading" src={loading} className="loading"/>
      return (
        <div>
          <form>
            <label>
                <TextField
                  type="text"
                  className="SearchBar"
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      this.handleSubmit(e);
                    }}}
                  hintText="Make a Suggestion"
                  floatingLabelText="Make a Suggestion"
                  value ={this.state.search}
                  errorText = {this.state.errorTextSearch}
                  onChange={this.handleChange}
                  onSubmit={this.handleSubmit}
                  underlineFocusStyle = {styles.underlineStyle}
                  floatingLabelFocusStyle = {styles.floatingLabelFocusStyle}
                />
                <RaisedButton label="Search" className="SearchButton" secondary={true} onClick={this.handleSubmit}/>
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
