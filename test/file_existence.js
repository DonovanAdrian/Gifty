import assert from 'assert';
import fs from 'fs';
import path from 'path';
import glob from 'glob';
import pkg  from './../package.json';

const dirs = pkg['h5bp-configs'].directories;

const expectedFilesInArchiveDir = [
  `${pkg.name}_v${pkg.version}.zip`
];

const expectedFilesInDistDir = [
  'css/',
  'css/main.css',
  'css/login.css',

  'doc/',
  'doc/TOC.md',
  'doc/css.md',
  'doc/extend.md',
  'doc/faq.md',
  'doc/html.md',
  'doc/js.md',
  'doc/misc.md',
  'doc/usage.md',

  'img/',
  'img/.gitignore',
  'img/bellNotificationOff.png',
  'img/bellNotificationOn.png',
  'img/giftyicon.png',
  'img/giftyiconweb.png',
  'img/newInvite.png',

  'js/',
  'js/boughtGiftsAlg.js',
  'js/confirmationAlg.js',
  'js/faqAlg.js',
  'js/friendListAlg.js',
  'js/giftAddUpdate.js',
  'js/homeAlg.js',
  'js/indexAlg.js',
  'js/invitesAlg.js',
  'js/listsAlg.js',
  'js/moderationAlg.js',
  'js/passOp.js',
  'js/privateFriendListAlg.js',
  'js/settingsAlg.js',
  'js/userAddUpdateAlg.js',

  '.editorconfig',
  '.gitattributes',
  '.gitignore',
  '404.html',
  'boughtGifts.html',
  'confirmation.html',
  'faq.html',
  'friendList.html',
  'giftAddUpdate.html',
  'home.html',
  'humans.txt',
  'index.html',
  'invites.html',
  'lists.html',
  'moderation.html',
  'privateFriendList.html',
  'robots.txt',
  'settings.html',
  'site.webmanifest',
  'userAddUpdate.html',
];

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function checkFiles(directory, expectedFiles) {

  // Get the list of files from the specified directory
  const files = glob.sync('**/*', {
    'cwd': directory,
    'dot': true,      // include hidden files
    'mark': true      // add a `/` character to directory matches
  });

  // Check if all expected files are present in the
  // specified directory, and are of the expected type
  expectedFiles.forEach((file) => {

    let ok = false;
    const expectedFileType = (file.slice(-1) !== '/' ? 'regular file' : 'directory');

    // If file exists
    if (files.indexOf(file) !== -1) {

      // Check if the file is of the correct type
      if (file.slice(-1) !== '/') {
        // Check if the file is really a regular file
        ok = fs.statSync(path.resolve(directory, file)).isFile();
      } else {
        // Check if the file is a directory
        // (Since glob adds the `/` character to directory matches,
        // we can simply check if the `/` character is present)
        ok = (files[files.indexOf(file)].slice(-1) === '/');
      }

    }

    it(`"${file}" should be present and it should be a ${expectedFileType}`, () =>{
      assert.equal(true, ok);
    });

  });

  // List all files that should be NOT
  // be present in the specified directory
  (files.filter((file) => {
    return expectedFiles.indexOf(file) === -1;
  })).forEach((file) => {
    it(`"${file}" should NOT be present`, () => {
      assert(false);
    });
  });

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function runTests() {
  describe('Test if all the expected files, and only them, are present in the build directories', () => {

    describe(dirs.archive, () => {
      checkFiles(dirs.archive, expectedFilesInArchiveDir);
    });

    describe(dirs.dist, () => {
      checkFiles(dirs.dist, expectedFilesInDistDir);
    });
  });
}

runTests();
