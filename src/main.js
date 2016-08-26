// Modules
var threadList = require('./threadList.js');
var forumList = require('./forumList.js');
var common = require('./common.js');


// Get api key;



var config = common.config();
var cookies = getCookies();
if ('WP_API_KEY' in cookies && cookies.WP_API_KEY != 'null')
{
  config.API_KEY = cookies.WP_API_KEY;
}
else {
  config.API_KEY = window.prompt('Plase enter your API key.');
  document.cookie = 'WP_API_KEY=' + config.API_KEY;
}


initRouter(common.router());


function getCookies()
{
  var cookies = {};
  if (!document.cookie)
  {
    return cookies;
  }
  var items = document.cookie.split(';');
  items.forEach(function(item) {
    var keyVal = item.split('=');
    if (keyVal.length == 2)
    {
      cookies[String(keyVal[0]).trim()] = keyVal[1];
    }
  });
  return cookies;
}

function initRouter(router) {
  router.add('', function () {
    forumList.showForumList();
  });

  router.add('forum/:forumId/:forumName', function(r)
  {
    threadList.showThreadList(r.params.forumId);
  });

  router.processHash = function() {
    var hash = location.hash || '#';
    router.run(hash.slice(1));
  };

  window.addEventListener('hashchange', router.processHash);
  router.processHash();
}
