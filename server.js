const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser')
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
db.run("CREATE TABLE IF NOT EXISTS parties (code TEXT, username TEXT, FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE)", (err) => {
  if(err) return console.error(err.message);
});
db.run("CREATE TABLE IF NOT EXISTS playlists (key TEXT, name TEXT, party_id TEXT, FOREIGN KEY (party_id) REFERENCES party(code) ON DELETE CASCADE ON UPDATE CASCADE)", (err) => {
  if(err) return console.error(err.message);
});
db.run("CREATE TABLE IF NOT EXISTS songs (key TEXT, id TEXT, title TEXT, played int, thumbnail TEXT, votes INT, playlist_id TEXT, FOREIGN KEY (playlist_id) REFERENCES playlist(key) ON DELETE CASCADE ON UPDATE CASCADE)", (err) => {
  if(err) return console.error(err.message);
});

app.post('/api/register', (req, res) => {
  db.get("SELECT * FROM users WHERE username=?", [req.body.username], (err, row) =>{
    if(err) return console.error(err.message);
    if(row) res.send({success: false});
    else {
      var hash = bcrypt.hashSync(req.body.password, 10);
      db.run("INSERT INTO users VALUES(?,?)", [req.body.username, hash], (err) =>{
        if(err) return console.error(err.message);
        res.send({success: true});
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  db.get("SELECT password FROM users WHERE username=?", [req.body.username], (err, row) =>{
    if(err) return console.error(err.message);
    if(row) res.send({success: bcrypt.compareSync(req.body.password, row.password)});
    else res.send({success: false});
  });
});

app.post('/api/createparty', (req, res) => {
  db.get("SELECT code FROM parties WHERE username=?", [req.body.username], (err, party) =>{
    if(err) return console.error(err.message);
    if(party) res.send({code: party.code});
    else{
      var string = randomstring.generate({
        length: 5,
        charset: 'alphabetic'
      }).toUpperCase();
      db.run("INSERT INTO parties VALUES(?,?)", [string, req.body.username], (err) => {
        if(err) return console.error(err.message);
        res.send({code: string});
      });
    }
  });
});

app.post('/api/createplaylist', (req, res) => {
  db.run("INSERT INTO playlists VALUES(?,?,?)", [req.body.key, req.body.name, req.body.code], (err) => {
    if(err) return console.error(err.message);
  });
  res.send({message: "Room " + req.body.name + " Created"});
});

app.post('/api/checkparty', (req,res) => {
  db.get("SELECT * FROM parties WHERE code =?", [req.body.code], (err, row) => {
    if(err) return console.error(err.message);
    if(row) res.send({exists: true});
    else res.send({exists: false});
  });
});

app.post('/api/deleteplaylist', (req, res) =>{
  db.run("DELETE FROM playlists WHERE key=?", [req.body.key], (err)=>{
    if(err) return console.error(err.message);
  });
  res.send({message: "Room " + req.body.name + " deleted."});
});

app.post('/api/addsong', (req, res) =>{
  db.get("SELECT votes FROM songs WHERE key=?", [req.body.key], (err, value)=>{
    if(err) return console.error(err.message);
    if(value) res.send({message: "song already exists"});
    else{
      db.run("INSERT INTO songs (key, id, title, played, thumbnail, votes, playlist_id) VALUES(?,?,?,?,?,?,?)", [req.body.key, req.body.id, req.body.title, 0, req.body.thumbnail, 0, req.body.playlist], (err)=>{
        if(err) return console.error(err.message);'server.js'
        res.send({message: "added " + req.body.title});
      });
    }
  });
});

app.post('/api/getplaylists', (req, res)=>{
  db.all("SELECT name FROM playlists WHERE party_id=? ORDER BY key ASC", [req.body.code], (err, rows)=>{
    if(err) return console.error(err.message);
    res.send({rooms: rows});
  });
});

app.post('/api/getsongs', (req, res) =>{
  db.all("SELECT * FROM songs WHERE playlist_id=? ORDER BY votes DESC", [req.body.playlist], (err, rows)=>{
    if(err) return console.error(err.message);
    res.send({songs: rows});
  });
});

app.post('/api/played', (req, res) =>{
  //TODO THIS ISN'T UPDATING
  var played = 1;
  db.run("UPDATE songs SET played=? WHERE key=?", [played, req.body.key], (err, value)=>{
    if(err) return console.error(err.message);
    res.send({success: true});
  })
})

app.post('/api/upvote', (req, res) => {
  db.get("SELECT votes FROM songs WHERE key=?", [req.body.key], (err, value)=>{
    if(err) return console.error(err.message);
    var votes = value.votes +  1;
    db.run("UPDATE songs SET votes=? WHERE key=?", [votes, req.body.key], (err)=>{
      if(err) return console.error(err.message);
    });
    res.send({message: req.body.key + " upvoted. Votes = " + votes});
  });
});

app.post('/api/downvote', (req, res) => {
  db.get("SELECT votes FROM songs WHERE key=?", [req.body.key], (err, value)=>{
    if(err) return console.error(err.message);
    var votes = value.votes-1;
    if(votes <= -5){
      db.run("DELETE FROM songs WHERE key=?", [req.body.key], (err) =>{
        if(err) return console.error(err.message);
      });
      res.send({message: req.body.key + " deleted from playlist"});
    }
    else{
      db.run("UPDATE songs SET votes=? WHERE key=?", [votes, req.body.key], (err)=>{
        if(err) return console.error(err.message);
      });
      res.send({message: req.body.key+" downvoted. Votes = "+votes});
    }
  });
});
