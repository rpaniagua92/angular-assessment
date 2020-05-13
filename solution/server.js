const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
var hsts = require('hsts');
const path = require('path');
var xssFilter = require('x-xss-protection');
var nosniff = require('dont-sniff-mimetype');
const request = require('request');

const app = express();

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(xssFilter());
app.use(nosniff());
app.set('etag', false);
app.use(
  helmet({
    noCache: true
  })
);
app.use(
  hsts({
    maxAge: 15552000 // 180 days in seconds
  })
);

app.use(
  express.static(path.join(__dirname, 'dist/softrams-racing'), {
    etag: false
  })
);

app.get('/api/members', (req, res) => {
  request('http://localhost:3000/members', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

app.get('/api/members/:memberId', (req, res) => {
  request('http://localhost:3000/members?id='+ req.params.memberId, (err, response, body) => {
    if(response.statusCode <= 500){
      res.send(JSON.parse(body)[0]);
     }
  });
});

// TODO: Dropdown!
app.get('/api/teams', (req, res) => {
  request('http://localhost:3000/teams', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });

});

// Submit Form!
app.post('/api/addMember', (req, res) => {
  request.post('http://localhost:3000/members', {json: req.body}, (err, response, body) => {
    if (res.statusCode <= 500) {
      res.send(body);
    }
  });
});

app.put('/api/updateMember/:memberId', (req, res) => {
  request.put('http://localhost:3000/members/' + req.params.memberId, {json: req.body}, (err, response, body) => {
    if (res.statusCode <= 500) {
      res.send(body);
    }
  });
});

app.delete('/api/deleteMember/:memberId', (req, res) => {
  request.delete('http://localhost:3000/members/' + req.params.memberId, (err, response, body) => {
  if (res.statusCode <= 500) {
      res.send(body);
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/softrams-racing/index.html'));
});

app.listen('8000', () => {
  console.log('Vrrrum Vrrrum! Server starting!');
});
