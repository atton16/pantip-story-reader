const cheerio = require('cheerio');
const request = require('request');

// Pantip Client

// Get Pantip story
// return: HTML page of the story
function getStory(id, cb) {
  id = parseInt(id);

  if(!(Number.isInteger(id) && id > 0))
    return cb(true, null);
  
  return request('https://pantip.com/topic/' + id + '/story', function (error, response, body) {
    if(!body) return cb(true, null);
    return cb(false, body);
  });
}

// Get Pantip comments
// return: comments in JSON format
function getComments(id, cb) {
  id = parseInt(id);

  if(!(Number.isInteger(id) && id > 0))
    return cb(true, null);

  return request('https://pantip.com/forum/topic_mode/render_comments?tid=' + id, function (error, response, body) {
    if(!body || body === '[]') cb(true, null);
    return cb(false, body);
  });
}

// Get Story title
function getTitle(id, cb) {
  id = parseInt(id);

  if(!(Number.isInteger(id) && id > 0))
    return cb(true, null);
  
  return getStory(id, function(err, story) {
    if(err)
      return cb(true, null);

    return cb(
      false,
      cheerio
        .load(
          story,
          { decodeEntities: false }
        )('#topic-'+id+' .display-post-title')
        .html()
    );

  });
}

module.exports = {
  getStory: getStory,
  getComments: getComments,
  getTitle: getTitle
};
