require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
var logger = require("morgan");
app.use(logger("dev"))
const cors=require('cors')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
db.on('error', (error) => console.error(error))
db.once('open', () => console.error("connected to database"))
app.use(express.json())

const pimRouter = require('./routes/user');
const authUser = require('./routes/auth');
const profile=require('./routes/profile');
const msg=require('./routes/messages')
//change when u need to make the token works
app.use('/users', pimRouter);
app.use('/auth', authUser);

app.use(verifyAdminToken);
app.use('/profile' , profile);
app.use('/message',msg);



app.listen(3000, () => {
  console.log('server start')

})




const jwt = require("jsonwebtoken");

function verifyAdminToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  console.log("tokenn:" ,token);
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
    console.log('hi')
    return res.sendStatus(403)
    }
      req.body["payload"] = user;
    next(); // pass the execution off to whatever request the client intended
  });
}

function verifySuperAdminToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (req.body.payload.role !== 0) return res.sendStatus(401); // user not Super Admin

  next();
}