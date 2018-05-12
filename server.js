const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const randomstring = require('randomstring');
const fs = require('fs');
const forceSSL = require('express-force-ssl');
const https = require('https');
const bcrypt = require('bcrypt');

var privateKey = fs.readFileSync('sslcrt/private.key');
var cetificate = fs.readFileSync('sslcrt/primary.crt');
var credentials = {key: privateKey, cert: cetificate};

const app = express();
const port = process.env.PORT || 5000;
app.use(cookieParser());
app.use(session({secret:"Secret"}));
app.use(bodyParser.json());
app.use(forceSSL);
var httpsServer = https.createServer(credentials, app).listen(port, () => console.log(`Listening on port ${port}`));

let db = new sqlite3.Database('data/db.db', (err) => {
  if(err) return console.error(err.message);
  console.log("Connected to the SQlite database.");
});

db.run("CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT)", (err) => {
  if(err) return console.error(err.message);
})
db.run("CREATE TABLE IF NOT EXISTS parties (key TEXT, user TEXT, username TEXT, FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE)", (err) => {
  if(err) return console.error(err.message);
});
db.run("CREATE TABLE IF NOT EXISTS playlists (key TEXT, party_id TEXT, FOREIGN KEY (party_id) REFERENCES party(key) ON DELETE CASCADE ON UPDATE CASCADE)", (err) => {
  if(err) return console.error(err.message);
});
db.run("CREATE TABLE IF NOT EXISTS songs (key TEXT, title TEXT, link TEXT, thumbnail TEXT, votes INT, playlist_id TEXT, FOREIGN KEY (playlist_id) REFERENCES playlist(key) ON DELETE CASCADE ON UPDATE CASCADE)", (err) => {
  if(err) return console.error(err.message);
});

app.get('/', function(req, res){
  res.cookie('name', 'express').send('cookie set');
});

app.post('/api/register', (req, res) => {
  //TODO check if username is taken
  db.run("INSERT INTO users VALUES(?,?)", [req.body.user, req.body.name], (err) =>{
    if(err) return console.error(err.message);
  });
});

app.get('/api/createparty', (req, res) => {
  var string = randomstring.generate({
    length: 5,
    charset: 'alphabetic'
  }).toUpperCase();
  //TODO check if the string already is a party
  //TODO add username
  db.run("INSERT INTO parties VALUES(?,?)", [string, req.body.user], (err) => {
    if(err) return console.error(err.message);
  });
  console.log("Party Created. Code: " + string);
  res.send({code: string});
});

app.post('/api/createplaylist', (req, res) => {
  //TODO needs a unique id not just a room name
  db.run("INSERT INTO playlists VALUES(?,?,?)", [req.body.name, req.body.code], (err) => {
    if(err) return console.error(err.message);
  });
  console.log("Room " + req.body.name + " Created in Party " + req.body.code);
  res.send({message: "Room " + req.body.name + " Created"});
});

app.post('/api/checkparty', (req,res) => {
  db.run("SELECT EXISTS(SELECT 1 FROM parties WHERE key =? LIMIT 1)", req.body.code, (err, ans) =>{
    if(err) return console.error(err.message);
    if(ans=1) res.send({exists: true});
    else res.send({exists: false});
  });
});

app.post('/api/deleteplaylist', (req, res) =>{
  db.run("DELETE FROM playlists WHERE key=?", req.body.name, (err)=>{
    if(err) return console.error(err.message);
  });
  res.send({message: "Room " + req.body.name + " deleted."});
});

app.post('/api/addsong', (req, res) =>{
  //TODO check if song already exists in the playlist
  //TODO Should the ID be the song id + the playlist id to make it unique?
  db.run("INSERT INTO songs (key, title, link, thumbnail, votes, playlist_id) VALUES(?,?,?,?,?,?)", [req.body.id, req.body.title, req.body.link, req.body.thumbnail, 0, req.body.playlist], (err)=>{
    if(err) return console.error(err.message);
  });
  res.send({message: "added " + req.body.id});
});

app.post('/api/getplaylists', (req, res)=>{
  db.all("SELECT key FROM playlists WHERE party_id =?", req.body.code, (err, rows)=>{
    if(err) return console.error(err.message);
    res.send({rooms: rows});
  });
});

app.post('/api/getsongs', (req, res) =>{
  db.all("SELECT * FROM songs WHERE playlist_id=?", req.body.playlist, (err, rows)=>{
    if(err) return console.error(err.message);
    res.send({songs: rows});
  });
});

app.post('/api/upvote', (req, res) => {
  //TODO increment/decrement votes
  //TODO if > 3 add to playlist
  var votes=0;
  db.run("SELECT votes FROM songs WHERE key=?", req.body.key, (err, value)=>{
    if(err) return console.error(err.message);
    console.log(value);
    votes = value;
  });
  votes++;
  db.run("UPDATE songs SET votes=? WHERE key=?", [votes, req.body.key], (err)=>{
    if(err) return console.error(err.message);
  });
  res.send({message: req.body.key + " upvoted. Votes = " + votes});
});

app.post('/api/downvote', (req, res) => {
  //TODO increment/decrement votes
  //TODO if <= -5 remove suggestion
  var votes=0;
  db.run("SELECT votes FROM songs WHERE key=?", req.body.key, (err, v)=>{
    if(err) return console.error(err.message);
    console.log(v);
    votes = v;
  });
  votes--;
  if(votes <= -3){
    db.run("DELETE FROM songs WHERE key=?", req.body.key, (err) =>{
      if(err) return console.error(err.message);
    });
    res.send({message: req.body.key + " deleted from playlist"});
  }
  else{
    db.run("UPDATE songs SET votes=? WHERE key=?", [votes, req.body.key], (err)=>{
      if(err) return console.error(err.message);
    });
    res.send({message: req.body.key + " downvoted. Votes = "+votes});
  }
});
