## Apps

#### Local development

```bash
# build:
$ cd subql
$ yarn boot
$ yarn build:common
$ yarn build:apps crab

# run docker
$ cd packages/apps/
$ docker-compose up
```

As the terminal log below that you can start playground at `http://localhost:3000`

```bash
graphql-engine_1  | 2022-11-15T11:12:47.120Z <nestjs> INFO Starting Nest application...
graphql-engine_1  | 2022-11-15T11:12:47.141Z <nestjs> INFO AppModule dependencies initialized
graphql-engine_1  | 2022-11-15T11:12:47.142Z <nestjs> INFO ConfigureModule dependencies initialized
graphql-engine_1  | 2022-11-15T11:12:47.142Z <nestjs> INFO GraphqlModule dependencies initialized
graphql-engine_1  | 2022-11-15T11:12:47.156Z <subql-query> INFO Started playground at http://localhost:3000
```
