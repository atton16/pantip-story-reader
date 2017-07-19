const express = require('express');
const path = require('path');
const pantipClient = require('./pantipClient');

const app = express();

// Configs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Serve static files
app.use(express.static('public'));

// Serve pages
app.get('/', function (req, res) {
  const s = req.query.s;

  // Process search query
  if(s) {
    var pattern = /((https?:\/\/)?(www.)?pantip.com\/topic\/)?([0-9]{1,})/i;
    var match = pattern.exec(s);
    if(match && match.length === 5){
      const topicId = match[4];
      return pantipClient.getTitle(topicId, function(err, title){
        if(err) {
          return res.status(404).render('index', { title: 'Not Found' });
        }
        return res.render('index', { title: title });
      });
    } else {
      return res.status(404).render('index', { title: 'Not Found' });
    }
  }

  // No search query, Render home page
  return res.render('index', {title: ''});
});

// APIs
app.get('/story/:id', function (req, res) {
  pantipClient.getStory(req.params.id, function(err, story){
    if(err) res.send();
    else res.send(story);
  });
});

app.get('/comments/:id', function (req, res) {
  pantipClient.getComments(req.params.id, function(err, comments){
    if (err) res.json();
    else res.json(comments);
  });
});

// Start server
app.listen(3010, function () {
  console.log('Listening on port 3010!');
});
