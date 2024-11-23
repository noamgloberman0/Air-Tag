const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const comment_routes = require('./routes/comment_routes');
const post_routes = require('./routes/post_routes');

app.use(express.json());
app.use('/api/comments', comment_routes);
app.use('/api/posts', post_routes);

app.listen(port, () => {

    // connect to mongodb
    mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
      .then(() => console.log('MongoDB connected'))
      .catch(err => console.error('MongoDB connection error:', err));

    console.log(`Server is running on port ${port}`);
  });
