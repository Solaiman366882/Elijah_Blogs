const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


//Middlewares
app.use(cors());
app.use(express.json());






//server initialize
app.get('/', (req,res) => {
    res.send('Coffee Server is Running')
});

app.listen(port, (req,res) => {
    console.log(`The server is running on port: ${port}`);
})