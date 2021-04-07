require("dotenv").config();
const express = require("express");
const userdb = require('../models/model')
const router = express.Router();
var nodemailer = require('nodemailer');


const jwt = require("jsonwebtoken");
//get one email
router.post('/reset', (req, res) => {
  try {
    let email = req.body.email;
    userdb.find({ email: email }).then((user) => {
      compte = user[0]
      if (compte) {

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { 
            user: 'pimmpim40@gmail.com',
            pass: '123456789azer@@'
          }
        });
        var mailOptions = {
          from: 'pimmpim40@gmail.com',
          to: compte.email,
          subject: 'Change password',
          text: 'click here to change password: http://localhost:4200/change/' + compte.id
        };
        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        res.json({
          isemail: true,
        });
      }
      else {
        res.json({
          isemail: false
        })
      }
    }
    )

  } catch (error) {
    console.log(error);

  }


})

router.post("/socauth", (req, res) => {
  try {
    let newUser =new userdb ({
      nom: req.body.nom,
      email: req.body.email,
      prenom: req.body.prenom,
      image: req.body.image,
      social: true,
      verified: true
    })
  userdb.find({ email: newUser.email }).then((sss) => {
    ss=sss[0]
    console.log(ss)

    if(ss){
  let payload = {
    id: ss.id,
    role: ss.role,
  };
  const token = jwt.sign(payload, process.env.TOKEN_SECRET)
  res.json({
    token: token,
    user: ss,
  });
}else{
    newUser.save().then((user) => {
      console.log('hello',user)
      compte = user;
      if (compte) {
        let payload = {
          id: compte.id,
          role: compte.role,
        };
        console.log(payload);
        const token = jwt.sign(payload, process.env.TOKEN_SECRET)
        console.log('hello',compte)

        res.json({
          token: token,
          user: compte,
        });

      } else {
        res.status(401);
        res.json({
          error: "UNAUTHORIZED",
        });
      }}
      )}
    })

  } catch (err) {
    console.log(err.code)
    if (err.code === 11000) {
      res.json({ created: true });
    }
  }
});
router.post("/", (req, res) => {

  try {
    console.log(req.body)
    let email = req.body.email;
    let password = req.body.password;
    console.log(email,password)
    userdb.find({ email: email, password: password }).then((user) => {
      compte = user[0];
      if (compte) {
        let payload = {
          id: compte.id,
          role: compte.role,
        };
        console.log(payload);
        const token = jwt.sign(payload, process.env.TOKEN_SECRET)
        res.json({
          token: token,
          user: compte,
        });
      } else {
        res.status(401);
        res.json({
          error: "UNAUTHORIZED",
        });
      }
    })

  } catch (err) {
    res.json({
      error: err,
    });
  }
});

module.exports = router