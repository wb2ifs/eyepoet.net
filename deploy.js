const SftpClient = require('ssh2-sftp-client');
const sftp = new SftpClient();

const util = require('util');
const glob = util.promisify(require('glob'));
const upath = require('upath');
const fs = require('fs');

let itemsToUpload = [];

if (!process.env.FTP_DEPLOY_HOST) throw new Error('FTP_DEPLOY_HOST not set')
if (!process.env.FTP_DEPLOY_PORT) throw new Error('FTP_DEPLOY_PORT not set')
if (!process.env.FTP_DEPLOY_USERNAME) throw new Error('FTP_DEPLOY_USERNAME not set')
if (!process.env.FTP_DEPLOY_PASSWORD) throw new Error('FTP_DEPLOY_PASSWORD not set')

sftp.connect({
  host: process.env.FTP_DEPLOY_HOST,
  port: process.env.FTP_DEPLOY_PORT,
  username: process.env.FTP_DEPLOY_USERNAME,
  password: process.env.FTP_DEPLOY_PASSWORD
})
.then(() => scanLocalFiles())
.then(items => {
  if (!items || items.length < 1) throw new Error('Nothing to upload!');

  console.log(items);
  itemsToUpload = items;
})
.then(() => cleanRemote())
.then(() => createDirectoriesFor(itemsToUpload))
.then(() => uploadFiles(itemsToUpload))
.then(() => sftp.end())
.catch(err => {
  sftp. end();
  console.error(err);
  process.exit(1);
})

function scanLocalFiles() {
  let localPublicDir = upath.join(process.cwd(), '_site');

  return glob(`${localPublicDir}/**/*`).then(globMatches => {
    let items = globMatches.map(path => {
      return {
        isDirectory: fs.lstatSync(path).isDirectory(),
        localPath: path
      }
    });

    return items;
  })
}

function cleanRemote(){
  console.log('\nCleaning remote server');
}

function createDirectoriesFor(items) {
  console.console.log('Creating directories');
}

function uploadFiles(items) {
  console.log('Uploading Files');
}
