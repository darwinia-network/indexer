const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const pkg = process.argv[2];

function _dir(subpath) {
  const appDir = path.dirname(require.main.filename);
  return path.normalize(`${appDir}/../packages/${pkg}/${subpath}`);
}

function _chain() {
  let chain = process.argv[3];
  if (chain) {
    return chain.toLowerCase();
  }
  chain = process.env.CHAIN;
  if (chain) {
    return chain.toLowerCase();
  }
  console.error('[publish] missing chain, please set it from cli argument or set an environment names CHAIN');
  process.exit(1);
}

function publishSubql(chain) {
  const manifestSourcePath = _dir(`project/${chain}.yaml`);
  const manifestDestPath = _dir('project.yaml');
  console.info('[publish] prepare publish subql');
  try {
    if (fs.existsSync(manifestDestPath)) {
      fs.rmSync(manifestDestPath);
    }
    const data = fs.readFileSync(manifestSourcePath);
    fs.appendFileSync(manifestDestPath, '###! IMPORTANT\n## This file is auto generated. please do not modify it.\n###!\n\n');
    fs.appendFileSync(manifestDestPath, data);
    const ret = childProcess.execSync('npx subql publish', {
      cwd: _dir('/'),
      encoding: 'utf8',
    });
    console.log(ret);
  } finally {
    // fs.rmSync(manifestDestPath);
  }
  console.info('[publish] published subql');
}

function main() {
  const chain = _chain();
  publishSubql(chain);
}

main();
