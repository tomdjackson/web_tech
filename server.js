const express = require('express');
const {google} = require('googleapis');
const sqlite3 = require('sqlite3').verbose();
const randomstring = require('randomstring');
const fs = require('fs');
const readline = require('readline');

let db = new sqlite3.Database('data/db.sqlite3', (err) => {
  if(err){
    return console.error(err.message);
  }
  console.log("Connected to the SQlite database.");
});

var forceSSL = require('express-force-ssl');
var http = require('http');
var https = require('https');

var privateKey = fs.readFileSync('sslcrt/private.key');
var cetificate = fs.readFileSync('sslcrt/primary.crt');

var credentials = {key: privateKey, cert: cetificate};

const app = express();
const port = process.env.PORT || 5000;
app.use(forceSSL);

var string = randomstring.generate(5).toUpperCase();

db.serialize(function () {
  console.log("SQLite3 running");
  console.log("Table name: " + string);
  db.run("CREATE TABLE IF NOT EXISTS " + string + " (key TEXT, value TEXT, count INTEGER)");
});

var httpsServer = https.createServer(credentials, app).listen(port, () => console.log(`Listening on port ${port}`));

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed the database connection.');
});
