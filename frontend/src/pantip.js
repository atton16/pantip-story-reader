function extractPost(topicId, $data) {
  var post = {
    title: $data.find('#topic-'+topicId+' .display-post-title').html(),
    story: $data.find('#topic-'+topicId+' .display-post-story').html(),
    author: $data.find('#topic-'+topicId+' .display-post-name.owner').html(),
    timestamp: $data.find('#topic-'+topicId+' .display-post-avatar-inner .display-post-timestamp abbr').attr('title')
  }
  // Story post-processing
  storyFooter = $('<div>'+post.story+'</div>').find('div').html();
  post.story = post.story.replace(storyFooter, '');
  post.story = post.story.replace('<div class="edit-history"></div>', '');

  // Post post-processing
  post.title = post.title.trim();
  post.story = post.story.trim();
  post.author = post.author.trim();
  post.timestamp = post.timestamp.trim();
  return post;
}

function extractComments(topicId, data) {
  return JSON.parse(data).comments;
}

var $pantip = {
  retrievePost: function(topicId, cb){
    // Actual retrieve
    // var url = 'https://pantip.com/topic/' + topicId + '/story';
    // var url = 'http://13.229.61.182/story/' + topicId;
    var url = location.protocol + '//' + location.hostname + '/pantip-story-reader/story/' + topicId;
    // var url = 'https://us-central1-pantip-story-reader-76bfe.cloudfunctions.net/story?id=' + topicId;
    $.ajax({
      url: url,
      type: 'get',
      success: cb
    });
    
    // Mock response
    // $.ajax({
    //   url: './mock/post.html',
    //   type: 'get',
    //   success: cb
    // });
    
  },
  retrieveComments: function(topicId, cb){
    // Actual retrieve
    // var url = 'https://pantip.com/forum/topic_mode/render_comments?tid=' + topicId;
    // var url = 'http://13.229.61.182/comments/' + topicId;
    var url = location.protocol + '//' + location.hostname + '/pantip-story-reader/comments/' + topicId;
    // var url = 'https://us-central1-pantip-story-reader-76bfe.cloudfunctions.net/comments?id=' + topicId;
    $.ajax({
      url: url,
      type: 'get',
      success: cb
    });
    
    // Mock response
    // $.ajax({
    //   url: './mock/comments.json',
    //   type: 'get',
    //   success: cb
    // });

  },
  extractPost: function(topicId, cb){
    $pantip.retrievePost(topicId, function(data){
      if(data.length !== 0)
        cb(extractPost(topicId, $(data)));
      else
        cb(null);
    });
  },
  extractComments: function(topicId, cb){
    $pantip.retrieveComments(topicId, function(data){
      if(data !== [])
        cb(extractComments(topicId, data));
      else
        cb(null);
    });
  }
};