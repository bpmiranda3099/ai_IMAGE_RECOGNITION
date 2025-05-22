require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/model', (req, res) => {
    res.sendFile(__dirname + '/public/model.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function getStarted() {
    window.location.href = 'model.html';
}