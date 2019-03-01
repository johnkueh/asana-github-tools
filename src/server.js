import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { handleHooks } from './services/asana';

const PORT = process.env.PORT || 8000;
const app = express();

app.use(bodyParser.raw({ type: '*/*' }));
app.get('/', (req, res) => {
  res.send('hello world');
});

app.post('/webhooks/asana', (req, res) => {
  handleHooks(req);

  res.set({
    'x-hook-secret': req.headers['x-hook-secret']
  });
  res.sendStatus(200);
});

app.listen({ port: PORT }, () => {
  console.log(`Server runnning on http://localhost:${PORT}`);
});
