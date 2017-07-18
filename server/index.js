const express = require('express');
const request = require('request');
const app = express();

app.get('/', function (req, res) {
  res.send('working!');
});

app.get('/story/:id', function (req, res) {
  const id = parseInt(req.params.id);
  if(!(Number.isInteger(id) && id > 0)) {
    res.send();
    return;
  }
  request('https://pantip.com/topic/' + id + '/story', function (error, response, body) {
    res.send(body);
  });
});

app.get('/comments/:id', function (req, res) {
  const id = parseInt(req.params.id);
  if(!(Number.isInteger(id) && id > 0)) {
    res.json();
    return;
  }
  request('https://pantip.com/forum/topic_mode/render_comments?tid=' + id, function (error, response, body) {
    res.json(body);
  });
});

app.listen(3010, function () {
  console.log('Listening on port 3010!')
});