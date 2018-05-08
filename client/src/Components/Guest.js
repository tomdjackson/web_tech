import React, { Component } from 'react';
import Search from './Search.js';
import Login from './Login.js'

class Guest extends Component{
  constructor(){
    super();
    this.state = {
      code: '',
      isLoggedIn: false
    }
    this.loginHandler = this.loginHandler.bind(this);
  }

  loginHandler(e){
    e.preventDefault();
    this.setState({isLoggedIn: true});
  }

  render(){
     const component = this.state.isLoggedIn?(<Search/>) : (<Login loginHandler = {this.loginHandler}/>);
    return (
      <div className='Host'>
        {component}
      </div>
    )
  }
}
export default Guest;
