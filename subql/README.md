# indexer

This repository includes index program.

## Subql

### How to develop

You can create follow [template](packages/template) project. and then add your
code to `src/handler/logic` directory. last add your logic class to
special [chain handler](packages/template/src/handler/chain/impls.ts).

### How to deploy

You can manually run [release ci](https://github.com/darwinia-network/indexer/actions/workflows/subql-release.yml)
when build success, you can see ipfs cid for last action.

then copy ipfs cid to ansible playbooks project.
