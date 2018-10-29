const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// static files
app.use(express.static('public'));

// routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth.html'));
});

// listen
app.listen(port, () => console.log(`App listening on port ${port}`));
