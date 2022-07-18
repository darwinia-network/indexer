const fs = require('fs');
const path = require('path');

function _dir(subpath) {
  const appDir = path.dirname(require.main.filename);
  return path.normalize(`${appDir}/../${subpath}`);
}

// write env data
function handleEnv() {
  const env = {
    CHAIN: process.env.CHAIN,
  };
  if (!env.CHAIN) {
    console.error('Missing CHAIN, please set it from environment.');
    process.exit(1);
  }
  const json = JSON.stringify(env, '', 2);
  const code = `export default ${json}\n`;

  const savePath = _dir('src/_env.ts');
  fs.writeFileSync(savePath, code);
  console.info('[prebuild] [env] wrote env to', savePath);
  console.info('[prebuild] ENV DATA: ', json);
}

// merge schema file
function handleSchema() {
  const schemaDir = _dir('schema');
  const files = fs.readdirSync(schemaDir, {withFileTypes: true})
    .filter(item => !item.isDirectory())
    .filter(item => item.name && item.name.indexOf('.schema.graphql') > 0)
    .map(item => item.name);
  const outputFile = _dir('schema.graphql');
  if (fs.existsSync(outputFile)) {
    fs.rmSync(outputFile);
  }
  for (const file of files) {
    const filePath = path.resolve(schemaDir, file);
    const data = fs.readFileSync(filePath);
    fs.appendFileSync(outputFile, data);
    console.info(`[prebuild] [schema] merge schema to ${outputFile} from ${file}`);
  }
  console.info('[prebuild] [schema] all schemas merged')
}

function main() {
  handleEnv();
  handleSchema();
}

main();

