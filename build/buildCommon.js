'use strict';

module.exports = {
  copy,
  fileIsNewer,
  copyFilesNewer,
  deleteFiles
};

var fs = require('fs');
var path = require('path');
var glob = require('glob');

function copy(srcFile, destFile)
{
  fs.writeFileSync(destFile, fs.readFileSync(srcFile));
}

/**
  Checks if file is newer than existing file in dest.
  Returns true if file doesn't exist.
*/
function fileIsNewer(newFile, dest)
{
  var fileStatExisting;
  try {
    fileStatExisting = fs.lstatSync(dest + path.basename(newFile));
  } catch (e) {
    return true;
  }

  var fileStatNew = fs.lstatSync(newFile);
  return fileStatNew.mtime > fileStatExisting.mtime;
}

function copyFilesNewer(srcGlob, dest)
{
  var files = glob.sync(srcGlob, {});
  for (let file of files)
  {
    if (fileIsNewer(file, dest))
    {
      console.log('Copying newer version of ' + path.basename(file));
      copy(file, dest + path.basename(file));
    }
  }
}

function deleteFiles(fileGlob)
{
  var files = glob.sync(fileGlob, {});
  for (let file of files)
  {
    console.log('Removing ' + path.basename(file));
    fs.unlinkSync(file);
  }
}
