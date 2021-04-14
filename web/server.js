const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/data', require('./routes/api/data'));

var server = app.listen(port, () => {
    console.log('Server started on port: ' + port);
})