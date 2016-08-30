// Exports
exports.showForumList = showForumList;

// Imports
var marko = require('marko');

// lodash
var _ = {
  each: require('lodash/each'),
  take: require('lodash/take'),
  groupBy: require('lodash/groupBy')
};

var common = require('./common.js');
var breadcrumbs = require('./breadcrumbs.js');
var forumListTpl = require('./templates/forumList.marko');

function showForumList()
{
  common.showLoading(true);
  common.logTiming('start');
  loadForumListThreads();
  if (common.state().forumList.forums === null)
  {
    common.ajax(common.buildServiceUrl({ get: 'forum'}), processForumData, common.handleError);
  }
}

function loadForumListThreads()
{
  common.ajax(common.buildServiceUrl({
    get: 'threads',
    threadcount: 100
  }), processForumThreads, common.handleError);
}

function processForumThreads(data, xhr)
{
  common.state().forumList.threads = data.THREADS;
  if (common.state().forumList.forums !== null)
  {
    processForumListAndThreads();
  }
}

function processForumData(data, xhr)
{
  common.state().forumList.forums = data.FORUM;

  if (common.state().forumList.threads !== null)
  {
    processForumListAndThreads();
  }

}

function processForumListAndThreads()
{
  common.logTiming('load', common.timing().start);
  var maxThreads = 3;
  var forums = common.state().forumList.forums;
  var threads = common.state().forumList.threads;

  var column1 = [];
  var column2 = [];
  var forumsBySection = _.groupBy(forums, function(i) { return i.SECTION; });
  var threadsByForumId = _.groupBy(threads, function(i) {return i.FORUM_ID; });
  var columnid = 1;

  _.each(forums, function(f) {
    if (f.ID in threadsByForumId)
    {
      f.THREADS = _.take(threadsByForumId[f.ID], 3);
    }
  });

  for (var section in forumsBySection) {
    var newVal = {
      SECTION: section,
      FORUMS: forumsBySection[section]
    };

    if (section == 'Mobile')
    {
      columnid = 2;
    }
    if (columnid ==1)
    {
      column1.push(newVal);
    }
    else {
      column2.push(newVal);
    }

  }

  var tplData = {
    COLUMNS: [column1, column2],
    slashFilter: common.slashFilter,
    timeSince: common.timeSince
  };

  common.logTiming('process', common.timing().load);

  var template = marko.load(forumListTpl);

  common.logTiming('compile', common.timing().process);

  template.render(tplData, function(err, html, out) {
    common.checkDomLoaded(function() {
      breadcrumbs.setBreadcrumbs([]);
      common.setContent(html, 'content');
    });

    common.logTiming('render', common.timing().compile);
    common.logTiming('totalTime', common.timing().start);
  });
}
