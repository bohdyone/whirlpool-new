var build = require('./buildCommon.js');

const outDir = 'dist/';
build.copyFilesNewer('src/html/*', outDir);
build.copyFilesNewer('src/img/*', outDir + 'img/');
