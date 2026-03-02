const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/error');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, '..', 'test.cmd');
  const content = fs.readFileSync(filePath, 'utf8');
  res.type('text/plain').send(content);
});

app.get('/linux', (req, res) => {
  const filePath = path.join(__dirname, '..', 'linux.cmd');
  const content = fs.readFileSync(filePath, 'utf8');
  res.type('text/plain').send(content);
});

app.get('/window', (req, res) => {
  const filePath = path.join(__dirname, '..', 'window.cmd');
  const content = fs.readFileSync(filePath, 'utf8');
  res.type('text/plain').send(content);
});

app.get('/mac', (req, res) => {
  const filePath = path.join(__dirname, '..', 'mac.cmd');
  const content = fs.readFileSync(filePath, 'utf8');
  res.type('text/plain').send(content);
});

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
