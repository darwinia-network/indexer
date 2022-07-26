

// const pkg = process.argv[2];

function handleArg() {
  const _args = process.argv;
  const args = _args.splice(2);
  const rets = [];
  if (args.indexOf('[deploy]')) {
    rets.push(...handleWithGitCommit(args[0]))
  } else {
    rets.push(handleWithRawCommand(args));
  }
  console.log(JSON.stringify(rets));
}

function handleWithGitCommit(commitMessage) {
  let msg = commitMessage.replace('[deploy]', '');
  const operationList = msg.split('|');
  const rets = [];
  for (const part of operationList) {
    const operation = part.trim();
    const rawCommand = operation.split(' ');
    const output = handleWithRawCommand(rawCommand);
    rets.push(output);
  }
  return rets;
}

function handleWithRawCommand(args) {
  if (!args.length) {
    console.error('[deploy] missing deploy arguments');
    process.exit(1);
  }
  const project = args[0];
  const chains = args.splice(1);
  const all = chains.indexOf('all') !== -1;
  return {
    project,
    chains,
    all,
  };
}


function main() {
  handleArg()
}

main()

