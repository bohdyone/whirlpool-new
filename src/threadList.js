exports.showThreadList = showThreadList;

var marko = require('marko');
var threadListTpl = require('./templates/threadList.marko');
var common = require('./common.js');
var breadcrumbs = require('./breadcrumbs.js');

function showThreadList(id)
{
  common.timing().startLoad = Date.now();
  common.showLoading(true);
  common.log('loading threads');
  var threads = common.ajax(common.buildServiceUrl({
    get: 'threads',
    forumids: id,
    threadcount: 100
  }), processThreadData, common.handleError);
}

function processThreadData(data, xhr)
{
  common.logTiming('load', common.timing().startLoad);
  var crumb = '';
  var template = marko.load(threadListTpl);

  data.timeSince = common.timeSince

  template.render(data, function(err, html, out) {


    common.checkDomLoaded(function() {
      if (data.THREADS.length > 0)
      {
        crumb = data.THREADS[0].FORUM_NAME;
        breadcrumbs.setBreadcrumbs([{Name: 'Forums', URL: '#'}, { Name: crumb }]);
      }
      scroll(0,0);
      common.setContent(html, 'content');
    });
    common.logTiming('render', common.timing().load);
  });
}
