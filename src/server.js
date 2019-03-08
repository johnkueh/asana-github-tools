import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { handleHooks as handleAsanaHooks } from './services/asana';
import { handleHooks as handleGithubHooks } from './services/github';

const PORT = process.env.PORT || 8000;
const app = express();

app.use(bodyParser.raw({ type: '*/*' }));
app.get('/', (req, res) => {
  res.send('hello world');
});

app.post('/webhooks/asana', (req, res) => {
  handleAsanaHooks(req);

  res.set({
    'x-hook-secret': req.headers['x-hook-secret']
  });
  res.sendStatus(200);
});

app.post('/webhooks/github', (req, res) => {
  handleGithubHooks(req);
  res.sendStatus(200);
});

app.listen({ port: PORT }, () => {
  console.log(`Server runnning on http://localhost:${PORT}`);
});
