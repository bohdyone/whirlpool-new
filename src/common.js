// Exports
module.exports =
{
  state: state,
  log: log,
  handleError: handleError,
  slashFilter: slashFilter,
  ajax: ajax,
  showLoading: showLoading,
  checkDomLoaded: checkDomLoaded,
  setContent: setContent,
  logTiming: logTiming,
  buildServiceUrl: buildServiceUrl,
  router: router,
  timing: timing,
  config: config
};

// Imports
var aja = require('aja');
var domready = require('domready');


// App state
var _state = {
    forumList:
    {
      forums: null,
      threads: null
    },
    retryPendingId: null
};

function state()
{
  return _state;
}

function config()
{
  return _config;
}

var _config = {
  DEBUG: true,
  LOAD_ANIM_DELAY: 500,
  ERROR_RETRY_DELAY: 2000,
  API_KEY: null
};

// Logging
function log(line)
{
  if (_config.DEBUG)
    console.log(line);
}

var _timing = {};

function timing()
{
  return _timing;
}

function logTiming(title, from)
{
  var now = Date.now();
  _timing[title] = now;
  log('Time for ' + title + ': ' + (now - from));
}


// Routing
var Rlite = require('rlite-router');
var _router = new Rlite();

function router()
{
  return _router;
}

// Requests
function ajax(url, success, failure)
{
  aja().url(url).on('success', success).on('error', failure).go();
}

function handleError()
{
  log('server error');
  if (_state.retryPendingId === null)
  {
    _state.retryPendingId = setTimeout(function() {
      _state.retryPendingId = null;
      _router.run(location.hash);
    }, _config.ERROR_RETRY_DELAY);
  }
}

function buildServiceUrl(params)
{
  function encodeQueryData(data)
  {
     var ret = [];
     for (var d in data)
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
     return ret.join("&");
  }

  var key = _config.API_KEY;
  var output = 'json';
  var extraParams = encodeQueryData(params);
  var url = 'https://whirlpool.net.au/api/?key=' + key + '&' + extraParams + '&output=' + output;
  return url;
}

function showLoading(visible)
{
  var content = document.getElementById('content');
  if (content === null)
  {
    return;
  }
  if (visible) {
    content.className = 'content faded_out';

    _state.loadPendingId = setTimeout(function() {
      var loader = document.getElementById('content_loader');
      loader.className = 'loader faded_in';
    }, _config.LOAD_ANIM_DELAY );
  }
  else {
    content.className = 'content faded_in';

    var loader = document.getElementById('content_loader');
    loader.className = 'loader faded_out';
    if (_state.loadPendingId !== null) {
      clearTimeout(_state.loadPendingId);
      _state.loadPendingId = null;
    }
  }
}

// Template helpers
function slashFilter(value) {
 if (typeof value === 'string') {
    return value.replace(/\//g, ' ');
  }
  return value;
}

// Async dom management
function checkDomLoaded(action)
{
  if (document.readyState === 'complete') {
      action();
    }
    else {
      log('dom not ready');
      domready(action);
    }
}

function setContent(content, el_name)
{
  document.getElementById(el_name).innerHTML = content;
  showLoading(false);
}
