# indexer

This repository includes index program.

## Subql

### How to develop

You can create follow [template](packages/template) project. and then add your
code to `src/handler/logic` directory. last add your logic class to
special [chain handler](packages/template/src/handler/chain/impls.ts).

> Cmd example

```bash
$ cd indexer/subql
$ yarn boot
$ yarn build:apps pangolin
$ yarn build:bridger pangolin
$ yarn build:mmr pangolin
```

### How to deploy (to Subquery hosted server)

Please create new commit to main branch. and the commit message format like this

```
[deploy-subql] mmr darwinia pangolin | apps all
```

this means you want to deploy project `mmr` and `apps`

the `mmr` project will be deployed with chain `darwinia` and `pangolin`
the `apps` project will be deployed to all chains, it's defined by
[subql-project-chain.json](../.maintain/subql-project-chain.json)
