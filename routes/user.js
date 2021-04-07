const express = require('express')
const router = express.Router()
const userdb = require('../models/model')
var nodemailer = require('nodemailer');
var code;


router.get('/role', (req, res) => {
  try {

    userdb.find({role:"user"}).then(users => {

      res.json(users);

    })
  }
  catch (err) {
    res.status(500).json({ message: err.message })

  }
})
//getting all
router.get('/', (req, res) => {
  try {

    userdb.find().then(users => {

      res.json(users);

    })
  }
  catch (err) {
    res.status(500).json({ message: err.message })

  }
})
//geting one
 router.get('/:id', getUser, (req, res) => {
  console.log("hello",res.user);
  sendmail(res.user.email);
     res.send(res.user);

 })
//creating one 
router.post('/', async (req, res) => {

  const compte = new userdb({
    nom: req.body.nom,
    prenom: req.body.prenom,
    password: req.body.password,
    role: req.body.role,
    email: req.body.email,
  })
  try {


    const newUser = await compte.save()
    if (newUser) {
      sendmail(compte.email);
      res.status(201).json({ user: newUser })
    }



  } catch (err) {
    console.log(err.code)
    if (err.code === 11000) {
      res.json({ isemail: true });
    }


  }
  //resend email
// router.get('/:id',getUser,(req,res)=>{
//   console.log("hello",res.user);
//   //sendmail(res.user.email);
//   res.send(res.user);

// })


})
//delete one 
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove()
    res.json({ message: 'deleted' })

  }
  catch (err) {

    res.status(500).json({ message: err.message })

  }


})
//update one

router.patch('/:id', getUser, (req, res) => {
  if (req.body.nom != null) {
    res.user.nom = req.body.nom

  }
  if (req.body.prenom != null) {
    res.user.prenom = req.body.prenom

  }
  if (req.body.password != null) {
    res.user.password = req.body.password

  } if (req.body.email != null) {
    res.user.email = req.body.email

  } if (req.body.code == code) {

    res.user.verified = true;

  }
  if (req.body.role != null) {
    res.user.role = req.body.role


  }
  if (req.body.image != null) {
    res.user.image = req.body.image


  }
  if (req.body.accepted != null) {
    res.user.accepted = req.body.accepted


  }
  try {

    res.user.save().then((updateduser) => {
      res.json(updateduser )

    })


  }
  catch (err) {
    res.status(400).json({ message: err.message })

  }


})


async function getUser(req, res, next) {
  try {
    user = await userdb.findById(req.params.id)
    if (user == null)
      return res.status(404).json({ message: "no data" })


  }
  catch (err) {
    return res.status(500).json({ message: err.message })

  }

  res.user = user
  next()
}

function sendmail(email) {
  code = Math.floor(Math.random() * 9999) + 111;
console.log("code:",code)
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pimmpim40@gmail.com',
      pass: '123456789azer@@'
    }
  });
  var mailOptions = {
    from: 'pimmpim40@gmail.com',
    to: email,
    subject: 'Sending verification email',
    text: 'to verif your email enter ' + code
    
  };
  transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }

  });

}
module.exports = router