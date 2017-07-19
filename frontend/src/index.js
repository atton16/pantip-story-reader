var pattern = /((https?:\/\/)?(www.)?pantip.com\/topic\/)?([0-9]{1,})/i;
var searchbox = {
  $: $('#searchbox'),
  state: undefined,
  deferTimeout: undefined,
  change: function(state) {
    if(state === ''){
      searchbox.empty();
      return;
    }
    var match = pattern.exec(state);
    if(match && match.length === 5)
      searchbox.match(state, match[4]);
    else
      searchbox.nomatch(state);
  },
  match: function(state, topicId) {
    UI.match(topicId);
    // Defer AJAX
    clearTimeout(searchbox.deferTimeout);
    searchbox.deferTimeout = setTimeout(function(){
      searchbox.search(topicId);
    }, 250);
  },
  nomatch: function(state) {
    UI.nomatch();
  },
  empty: function() {
    UI.empty();
  },
  search: function(topicId) {
    ga('send', 'event', 'search');
    $pantip.extractPost(topicId, function(post){
      if(post === null) {
        UI.failed();
        return;
      }
      title.$.html(post.title);
      author.$.html(post.author);
      timestamp.$.html(post.timestamp);
      story.$.html(post.story);
      origArticle.$.attr('href', 'https://pantip.com/topic/'+topicId+'/story');
      UI.success(topicId);
    });
    $pantip.extractComments(topicId, function(data){
      if(data === null || data === undefined) {
        comments.$.html('');
        UI.success(topicId);
        return;
      }
      var len = data.length;
      var html = '';
      for (var i = 0; i < len; i++) {
        var comment = data[i];
        var no = comment.comment_no;
        var timestamp = comment.data_addrtitle;
        var message = comment.message;
        html +=
          '<div class="comment" id="comment-no-'+no+'">'+
            '<div class="comment-divider"></div>'+
            '<div class="comment-head">'+
              'ความคิดเห็นที่ '+no+'<br/>'+
              timestamp+'<br/><br/>'+
            '</div>'+
            '<div>'+message+'</div>'
          '</div>';
      }
      comments.$.html(html);
      UI.success(topicId);
    });
  }
};
var resultbox = {
  $: $('div#resultbox')
};
var topicId = {
  $: $('div#resultbox span#topicid')
};
var origArticle = {
  $: $('div#resultbox a#orig-article')
};
var spinner = {
  $: $('div#resultbox div#spinner')
};
var resultcontent = {
  $: $('div#resultbox div#resultcontent')
};
var title = {
  $: $('div#resultbox h4#title')
};
var author = {
  $: $('div#resultbox div#author')
};
var timestamp = {
  $: $('div#resultbox div#timestamp')
};
var story = {
  $: $('div#resultbox div#story')
};
var comments = {
  $: $('div#resultbox div#comments')
};
var resulterror = {
  $: $('div#resultbox div#resulterror')
};
var errorbox = {$:$('div#errorbox')};
var toolbox = {
  $: {
    smaller: $('button#smaller'),
    bigger: $('button#bigger'),
    pantipMode: $('button#pantip-mode'),
    lightMode: $('button#light-mode')
  }
};
var UI = {
  'font-size': 14,
  match: function(id) {
    topicId.$.html(id);
    resultbox.$.show();
    spinner.$.show();
    resulterror.$.hide();
    resultcontent.$.hide();
    errorbox.$.hide();
  },
  nomatch: function() {
    resultbox.$.hide();
    errorbox.$.show();
  },
  empty: function() {
    resultbox.$.hide();
    errorbox.$.hide();
  },
  success: function(topicId) {
    spinner.$.hide();
    resulterror.$.hide();
    resultcontent.$.show();
    window.history.pushState("", "", '?s='+topicId);
  },
  failed: function() {
    spinner.$.hide();
    resulterror.$.show();
    resultcontent.$.hide();
  },
  pantipMode: function() {
    toolbox.$.pantipMode.hide();
    toolbox.$.lightMode.show();
    $('body').css('background-color', '#113364');
    $('body').css('color', 'white');
    $('a').css('color', '#ccc');
  },
  lightMode: function() {
    toolbox.$.pantipMode.show();
    toolbox.$.lightMode.hide();
    $('body').css('background-color', '');
    $('body').css('color', '');
    $('a').css('color', '');
  },
  smaller: function() {
    UI['font-size'] -= 2;
    if(UI['font-size'] < 14) {
      UI['font-size'] = 14;
    }
    $('#wholestory').css('font-size', UI['font-size']);
  },
  bigger: function() {
    UI['font-size'] += 2;
    if(UI['font-size'] > 48) {
      UI['font-size'] = 48;
    }
    $('#wholestory').css('font-size', UI['font-size']);
  }
}

// Detect changes in searchbox
searchbox.$.bind("change keyup input", function(){
  var val = $(this).val();
  if(searchbox.state !== val) {
    searchbox.state = val;
    searchbox.change(searchbox.state);
  }
});

// Toolbox
toolbox.$.smaller.click(function(e){
  UI.smaller();
});
toolbox.$.bigger.click(function(e){
  UI.bigger();
});
toolbox.$.pantipMode.click(function(e){
  UI.pantipMode();
});
toolbox.$.lightMode.click(function(e){
  UI.lightMode();
});

// Get query string
function queryString()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

// Auto search on pageload with query string
var s = queryString()['s'];
if(s) {
  searchbox.$.val(decodeURIComponent(s));
  searchbox.$.change();
}