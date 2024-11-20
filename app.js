const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose')

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error=>{console.error(error)})
db.once('open', ()=>console.log('connected to mongo'))