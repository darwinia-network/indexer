const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

function _dir(subpath) {
  const appDir = path.dirname(require.main.filename);
  return path.normalize(`${appDir}/../${subpath}`);
}

function _env() {
  let arg2 = process.env.CHAIN || process.argv[2];
  if (!arg2) {
    console.error('Missing CHAIN, please set it from environment.');
    process.exit(1);
  }
  let chain = arg2;
  if (chain.indexOf('.yaml')) {
    chain = chain.replace('.yaml', '');
    chain = chain.replace('subgraph-', '');
  }
  chain = chain.toLowerCase();
  return {
    CHAIN: chain,
  }
}

// write env data
function processEnv() {
  const env = _env();
  const json = JSON.stringify(env, '', 2);
  const code = `export const envar: {} = ${json}\n`;

  const savePath = _dir('src/chain.ts');
  fs.writeFileSync(savePath, code);
  console.info('[build] [env] wrote env to', savePath);
  console.info('[build] ENV DATA: ', json);
}

function buildProject() {
  let arg2 = process.env.CHAIN || process.argv[2];
  let subgraphFile;
  if (arg2.indexOf('.yaml')) {
    subgraphFile = arg2;
  } else {
    subgraphFile = `subgraph-${arg2}.yaml`;
  }
  console.info('[build] [codebuild] prepare build project');
  try {
    childProcess.execSync(`npx graph build ${subgraphFile}`, {
      cwd: _dir('/'),
      encoding: 'utf8',
      stdio: 'inherit',
    });
    // console.log(ret);
  } finally {
  }
  console.info('[build] [codebuild] build done');
}

function main() {
  processEnv();
  buildProject();
}

main();

