


function handleEnv() {
  const allowEnv = {
    CHAIN: process.env.CHAIN,
  };
  console.log('allow env: ', allowEnv)
}

function handleSchema() {}


function main() {
  handleEnv();
  handleSchema();
}

main();

