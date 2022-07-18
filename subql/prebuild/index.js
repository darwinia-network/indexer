const fs = require('fs');
const path = require('path');

const schemaLink = require('../schema/link.json');

function _dir(subpath) {
  const appDir = path.dirname(require.main.filename);
  return path.normalize(`${appDir}/../${subpath}`);
}

function _env() {
  let chain = process.env.CHAIN;
  if (!chain) {
    console.error('Missing CHAIN, please set it from environment.');
    process.exit(1);
  }
  chain = chain.toLowerCase();
  return {
    CHAIN: chain,
  }
}

// write env data
function handleEnv() {
  const env = _env();
  const json = JSON.stringify(env, '', 2);
  const code = `export default ${json}\n`;

  const savePath = _dir('src/_env.ts');
  fs.writeFileSync(savePath, code);
  console.info('[prebuild] [env] wrote env to', savePath);
  console.info('[prebuild] ENV DATA: ', json);
}

// merge schema file
function handleSchema() {
  const env = _env();
  const features = schemaLink[env.CHAIN];
  console.info(`[prebuild] [schema] found links [${features}] for ${env.CHAIN}`);
  const outputFile = _dir('schema.graphql');
  if (fs.existsSync(outputFile)) {
    fs.rmSync(outputFile);
  }

  for (const feature of features) {
    const schemaPath = path.resolve(_dir('schema'), feature, 'schema.graphql');
    const data = fs.readFileSync(schemaPath);
    const separator = `###\n## ${env.CHAIN} - ${feature}\n###\n`;
    fs.appendFileSync(outputFile, separator);
    fs.appendFileSync(outputFile, data);
    fs.appendFileSync(outputFile, '\n\n');
    console.info(`[prebuild] [schema] merge schema to ${outputFile} from ${schemaPath}`);
  }
  console.info('[prebuild] [schema] all schemas merged')
}

function main() {
  handleEnv();
  handleSchema();
}

main();

