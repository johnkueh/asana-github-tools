import 'dotenv/config';
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen({ port: 8000 }, () => {
  console.log('Node Server on http://localhost:8000');
});

console.log(process.env);
