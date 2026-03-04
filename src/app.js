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

const cmdRoute = (filename) => (req, res) => {
  const filePath = path.join(__dirname, '..', filename);
  const content = fs.readFileSync(filePath, 'utf8');
  res.type('text/plain').send(content);
};

app.get('/linux', cmdRoute('linux.cmd'));
app.post('/linux', cmdRoute('linux.cmd'));

app.get('/window', cmdRoute('window.cmd'));
app.post('/window', cmdRoute('window.cmd'));

app.get('/mac', cmdRoute('mac.cmd'));
app.post('/mac', cmdRoute('mac.cmd'));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
