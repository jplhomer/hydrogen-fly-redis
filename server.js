import {hydrogenMiddleware} from '@shopify/hydrogen/middleware';
import serveStatic from 'serve-static';
import compression from 'compression';
import bodyParser from 'body-parser';
import connect from 'connect';
import {RedisStorage} from '@miniflare/storage-redis';
import IORedis from 'ioredis';
import {Cache} from '@miniflare/cache';
import path from 'path';
const {
  InMemoryCache,
} = require('@shopify/hydrogen/dist/node/framework/cache/in-memory');

const inMemoryCache = new InMemoryCache();

const port = process.env.PORT || 8080;

function createServer() {
  const app = connect();

  // let cache;

  // if (process.env.REDIS_URL && process.env.REDIS_PASSWORD) {
  //   const redis = new IORedis({
  //     host: process.env.REDIS_URL,
  //     port: process.env.REDIS_PORT,
  //     password: process.env.REDIS_PASSWORD,
  //   });
  //   const redisStorage = new RedisStorage(redis, 'cache');
  //   cache = new Cache(redisStorage);
  // }

  app.use(compression());
  app.use(
    serveStatic(path.resolve(__dirname, '../', 'client'), {index: false}),
  );
  app.use(bodyParser.raw({type: '*/*'}));
  app.use(
    hydrogenMiddleware({
      getServerEntrypoint: () => import('./src/App.server'),
      indexTemplate: () => import('./dist/client/index.html?raw'),
      cache: inMemoryCache,
    }),
  );

  return app;
}

const app = createServer();

app.listen(port, () => {
  console.log(`Hydrogen server running at http://localhost:${port}`);
});
