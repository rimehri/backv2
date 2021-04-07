const express = require('express')
const router = express.Router()
const userdb = require('../models/message')
var nodemailer = require('nodemailer');

 //getting all
 router.get('/', (req, res) => {
    try {
  
      userdb.find().sort('created_at').then(messages => {
  
        res.json(messages);
  
      })
    }
    catch (err) {
      res.status(500).json({ message: err.message })
  
    }
  })

router.post('/', async (req, res) => {

    const compte = new userdb({
        whoSend: req.body.whoSend,
        content: req.body.content,
        toSend: req.body.toSend
    })
    try {

        const newUser = await compte.save()
        if (newUser) {
            res.status(201).json({ message: newUser })
        }



    } catch (err) {
        console.log(err.code)
        res.json(err);

    }


})
//envoyer
router.get('/tosend/:id', (req, res) => {
    let id=req.params.id;
   
    userdb.find({toSend : id }).then((messages) => {

        res.status(201).json(messages);

    })

  
   })
   //recu
   router.get('/whosend/:id', (req, res) => {
    let id=req.params.id;
   
    userdb.find({whoSend : id }).then((messages) => {

        res.status(201).json(messages);

    })

})



module.exports = router