import 'dotenv/config';
import express from 'express';
import { getMe, getTag, getTags, createTags } from './services/asana';

const app = express();

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen({ port: 8000 }, () => {
  console.log('Node Server on http://localhost:8000');
});
