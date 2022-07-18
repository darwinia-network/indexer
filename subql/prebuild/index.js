
// write env data
function handleEnv() {
  const allowEnv = {
    CHAIN: process.env.CHAIN,
  };
  console.log('allow env: ', allowEnv)
}

// merge schema file
function handleSchema() {}


function main() {
  handleEnv();
  handleSchema();
}

main();

