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

const projectRoot = process.cwd();

const sendCmdFile = (filename, res) => {
  const filePath = path.join(projectRoot, filename);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    res.type('text/plain').send(content);
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.status(404).type('text/plain').send(`File not found: ${filename}`);
      return;
    }
    throw err;
  }
};

app.get('/', (req, res) => sendCmdFile('test.cmd', res));

const cmdRoute = (filename) => (req, res) => sendCmdFile(filename, res);

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
