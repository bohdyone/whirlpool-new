// Exports
exports.setBreadcrumbs = setBreadcrumbs;

// Imports
var marko = require('marko');
var crumb = require('./templates/crumb.marko');
var common = require('./common.js');

// Lodash
var _ = {
  each: require('lodash/each')
};


function setBreadcrumbs(path)
{
  if (path.length === 0)
  {
    path = [{
      Name: 'Australian Discussion Forums',
      URL: null
    }];
  }
  var data = { path: path };

  var compileStart = Date.now();

  var template = marko.load(crumb);
  common.logTiming('compileBreadcrubs', compileStart);

  template.render(data, function(err, html) {
    _.each(document.getElementsByClassName('breadcrumb'), function(el) {
        el.innerHTML = html;
      });
      common.logTiming('renderBreadcrumbs', common.timing().compileBreadcrubs);
  });
}
