const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const schemaLink = require('../schema/relation.json');

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
function processEnv() {
  const env = _env();
  const json = JSON.stringify(env, '', 2);
  const code = `export default ${json}\n`;

  const savePath = _dir('src/_env.ts');
  fs.writeFileSync(savePath, code);
  console.info('[prebuild] [env] wrote env to', savePath);
  console.info('[prebuild] ENV DATA: ', json);
}

// merge schema file
function mergeSchema() {
  const env = _env();
  const {common, special} = schemaLink;

  // console.info(`[prebuild] [schema] found links [${features}] for ${env.CHAIN}`);
  const outputFile = _dir('schema.graphql');
  if (fs.existsSync(outputFile)) {
    fs.rmSync(outputFile);
  }
  const schemas = [
    ...common.map(item => {
      return {feature: item, type: 'common'}
    }),
  ];
  const chainFeatures = special[env.CHAIN];
  if (chainFeatures) {
    schemas.push(...chainFeatures.map(item => {
      return {feature: item, type: 'chain'}
    }));
  }

  fs.appendFileSync(outputFile, '###! IMPORTANT\n## This file is auto generated. please do not modify it.\n###!\n\n');
  for (const schema of schemas) {
    const {feature, type} = schema;
    const schemaPath = path.resolve(_dir('schema'), feature, 'schema.graphql');
    const data = fs.readFileSync(schemaPath);
    const separator = `###\n## ${type === 'common' ? 'common' : env.CHAIN} - ${feature}\n###\n`;
    fs.appendFileSync(outputFile, separator);
    fs.appendFileSync(outputFile, data);
    fs.appendFileSync(outputFile, '\n\n');
    console.info(`[prebuild] [schema] merge schema to ${outputFile} from ${schemaPath}`);
  }

  console.info('[prebuild] [schema] all schemas merged');
}

function genSchema() {
  const env = _env();
  const manifestSourcePath = _dir(`project/${env.CHAIN}.yaml`);
  const manifestDestPath = _dir('project.yaml');
  console.info('[prebuild] [codegen] prepare generate schema types');
  try {
    if (fs.existsSync(manifestDestPath)) {
      fs.rmSync(manifestDestPath);
    }
    const data = fs.readFileSync(manifestSourcePath);
    fs.appendFileSync(manifestDestPath, '###! IMPORTANT\n## This file is auto generated. please do not modify it.\n###!\n\n');
    fs.appendFileSync(manifestDestPath, data);
    const ret = childProcess.execSync('npx subql codegen', {
      cwd: _dir('/'),
      encoding: 'utf8',
    });
    console.log(ret);
  } finally {
    // fs.rmSync(manifestDestPath);
  }
  console.info('[prebuild] [codegen] generated schema types');
}

function main() {
  processEnv();
  mergeSchema();
  genSchema();
}

main();

