import {hydrogenMiddleware} from '@shopify/hydrogen/middleware';
import serveStatic from 'serve-static';
import compression from 'compression';
import bodyParser from 'body-parser';
import connect from 'connect';
import path from 'path';
const {
  InMemoryCache,
} = require('@shopify/hydrogen/dist/node/framework/cache/in-memory');

const inMemoryCache = new InMemoryCache();

const port = process.env.PORT || 8080;

function createServer() {
  const app = connect();

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
