const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const setupRoutes = require('./src/routes/index');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

setupRoutes(app);

app.use((err, req, res, next) => {
  console.error('Ошибка:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
