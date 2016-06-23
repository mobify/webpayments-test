'use strict';

const express = require('express');

let app = express();

app.set('port', (process.env.PORT || 3000));

app.get('/', (req, res) => {
    res.sendFile('src/index.html')
});

app.get('/static/bundle.js', (req, res) => {
    res.sendFile('dist/bundle.js')
});

app.listen(app.get('port'), () => console.log('App is running on port', app.get('port')));
