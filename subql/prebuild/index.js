
// write env data
function handleEnv() {
  const allowEnv = {
    CHAIN: process.env.CHAIN,
  };
  console.log('allow env: ', allowEnv)
  // todo: write env to src/common/-env.json
}

// merge schema file
function handleSchema() {
  // todo: merge schema/*.schema.graphql to schema.graphql
}


function main() {
  handleEnv();
  handleSchema();
}

main();

