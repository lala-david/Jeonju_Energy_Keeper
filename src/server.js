const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname)));  

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,  'src', 'index.html'));  
});
app.listen(8080, () => {
    console.log('서버 8080 on');
});
