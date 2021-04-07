const express = require('express')
const router = express.Router()
const userdb = require('../models/model')
const multer = require("multer");

const picsPath = require("path").resolve(__dirname, "../../pics");


  router.get("/download/:nom", function (req, res) {
    let nom = req.params.nom;
    const file = picsPath + "/" + nom;
    console.log(file,"hy")
    res.sendFile(file); // Set disposition and send it.
  });
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./../pics");
    },
    filename: (req, file, cb) => {
      var filetype = "";
      var fileExtension = "";
      if (file.mimetype === "image/gif") {
        filetype = "image-";
        fileExtension = "gif";
      }
      if (file.mimetype === "image/png") {
        filetype = "image-";
        fileExtension = "png";
      }
      if (file.mimetype === "image/jpeg") {
        filetype = "image-";
        fileExtension = "jpeg";
      }
  
      cb(null, filetype + Date.now() + "." + fileExtension);
      h = cb;
    },
  });
  var upload = multer({
    storage: storage,
  });


  router.post("/file", upload.single("file"), function (req, res, next) {
  
    if (!req.file) {
      res.status(500);
      return next(err);
    }
    res.json({
      img:   req.file.filename,
    });
  });



  router.get("/current", (req, res) => {
    try {
        console.log('console',req.body)
         userdb.find({_id:req.body.payload.id})
         .then((user) => {
           if (user) {
             res.json(user);
           } else {
             res.status(401);
             res.json({
               error: "UNAUTHORIZED",
             });
           }
         })
         .catch((err) => {
           res.status(401);
           res.json({
             error: "UNAUTHORIZED",
           });
         });
    } catch (err) {
      res.json({
        error: err.message,
      });
    }
  });

  router.get('/:id', (req, res) => {
    try {
  let id=req.params.id
      userdb.find({_id:id}).then(users => {
  
        res.json(users);
  
      })
    }
    catch (err) {
      res.status(500).json({ message: err.message })
  
    }
  })
  
router.patch('/:id', getUser, (req, res) => {
    console.log(req.body);
      if (req.body.nom != null&&req.body.nom !='') {
        res.user.nom = req.body.nom
    
      }
      if (req.body.prenom != null&&req.body.prenom !='') {
        res.user.prenom = req.body.prenom
    
      }
      if (req.body.password != null&&req.body.prenom !='') {
        res.user.password = req.body.password
    
      } if (req.body.email != null&&req.body.email !='') {
        res.user.email = req.body.email
    
      } 
      if (req.body.role != null&&req.body.role !='') {
        res.user.role = req.body.role
    
    
      }
      if (req.body.image != null&&req.body.image !='') {
        res.user.image = req.body.image
    
    
      }
      if (req.body.accepted != null) {
        res.user.accepted = req.body.accepted
    
    
      }
      try {
    
        res.user.save().then((updateduser) => {
          res.json(  updateduser )
    
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
    
module.exports = router
