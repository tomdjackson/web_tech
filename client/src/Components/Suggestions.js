import React, {Component} from 'react';

class Suggestions extends Component{
  constructor(){
    super();
    this.state ={
      songs: []
    }
    this.getSongs();
  }

  getSongs(){
    this.callApi()
        .then(res=>{
          var songArray = [];
          res.songs.forEach((song) =>{
            songArray.push(song.body);
          });
          this.setState({songs: songArray});
        })
        .catch(err => console.log(err));
  }

  callApi = async () =>{
    const response = await fetch('/api/getsongs', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({paylist: this.props.room})
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  render() {
    const options = this.state.songs.map(s => (
      <li>
        {s.title}
      </li>
    ))
    return <ul>{options}</ul>
  }
}

export default Suggestions;
