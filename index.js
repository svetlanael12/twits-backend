require('dotenv').config()
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const passport = require('passport');
const authRouter = require('./routers/auth')
const postRouter = require('./routers/post')
  
const app = express()
 
app.use(express.json());
app.use(cors({
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Accept,Origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Content-Type", 'application/json');
  next();
});

app.use('/', postRouter);
app.use('/auth', authRouter);
app.use(passport.initialize())
require('./middleware/authJwtMiddleware')(passport)
 
async function start(PORT) {
  try {
      await mongoose.connect('mongodb://localhost:27017/project-posts');
      app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (e) {
      console.log(e);
  }
}

const PORT = process.env.PORT || 3000;
 
start(PORT)