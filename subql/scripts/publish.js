const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

function _dir(subpath) {
  const appDir = path.dirname(require.main.filename);
  return path.normalize(`${appDir}/../${subpath}`);
}

function _chain() {
  const args = process.argv.slice(2);
  let chain = args[0];
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
    fs.copyFileSync(manifestSourcePath, manifestDestPath);
    const ret = childProcess.execSync('npx subql publish', {
      cwd: _dir('/'),
      encoding: 'utf8',
    });
    console.log(ret);
  } finally {
    fs.rmSync(manifestDestPath);
  }
  console.info('[publish] published subql');
}

function main() {
  const chain = _chain();
  publishSubql(chain);
}

main();
