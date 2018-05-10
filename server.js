const express = require('express');
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
const randomstring = require('randomstring');
const fs = require('fs');
const forceSSL = require('express-force-ssl');
const https = require('https');

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

db.run("CREATE TABLE IF NOT EXISTS parties (key TEXT, user TEXT)", (err) => {
  if(err) return console.error(err.message);
});
db.run("CREATE TABLE IF NOT EXISTS playlists (key TEXT, party_id TEXT, FOREIGN KEY (party_id) REFERENCES party(key) ON DELETE CASCADE ON UPDATE CASCADE)", (err) => {
  if(err) return console.error(err.message);
});
db.run("CREATE TABLE IF NOT EXISTS songs (key TEXT, body VARCHAR, votes INT, playlist_id TEXT, FOREIGN KEY (playlist_id) REFERENCES playlist(key) ON DELETE CASCADE ON UPDATE CASCADE)", (err) => {
  if(err) return console.error(err.message);
});

app.get('/api/createparty', (req, res) => {
  var string = randomstring.generate({
    length: 5,
    charset: 'alphabetic'
  }).toUpperCase();
  //TODO  check if the string already is a party
  //TODO  add username
  db.run("INSERT INTO parties VALUES(?,?)", [string, 'me'], (err) => {
    if(err) return console.error(err.message);
  });
  console.log("Party Created. Code: " + string);
  res.send({code: string});
});

app.post('/api/createplaylist', (req, res) => {
  //TODO needs a unique id not just a room name
  db.run("INSERT INTO playlists VALUES(?,?)", [req.body.name, req.body.code], (err) => {
    if(err) return console.error(err.message);
  });
  console.log("Room " + req.body.name + " Created in Party " + req.body.code);
  res.send({message: "Room " + req.body.name + " Created"});
});

app.post('/api/checkparty', (req,res) => {
  console.log(req.body.code);
  db.run("SELECT EXISTS(SELECT 1 FROM parties WHERE key = ?", req.body.code + " LIMIT 1)", (err, ans) =>{
    if(ans=1) res.send({exists: true});
    else res.send({exists: false});
  });
});

app.post('/api/deleteplaylist', (req, res) =>{
  console.log(req.body.name);
  db.run("DELETE FROM playlists WHERE key=?", req.body.name, (err)=>{
    if(err) return console.error(err.message);
  });
  res.send({message: "Room" + req.body.name + " deleted."});
});

app.post('/api/addsong', (req, res) =>{
  db.run("INSERT INTO songs VALUES(?,?,?,?)", [req.body.id, req.body.body, 0, req.body.playlist], (err)=>{
    if(err) return console.error(err.message);
  });
});

app.post('/api/getplaylists', (req, res)=>{
  db.all("SELECT key FROM playlists WHERE party_id =?", req.body.code, (err, rows)=>{
    if(err) return console.error(err.message);
    res.send({rooms: rows});
  });
});

app.post('/api/getsongs', (req, res) =>{
  db.all("SELECT body FROM songs WHERE playlist_id =?", req.body.code, (err, rows)=>{
    if(err) return console.error(err.message);
    res.send({rooms: rows});
  });
});
