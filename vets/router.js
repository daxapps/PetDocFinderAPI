const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const { Vet } = require("./models");
const { Service }  = require("../services/models");

const router = express.Router();

const jsonParser = bodyParser.json();

// Post Vet info
router.post("/vetlist", jsonParser, (req, res) => {
  var googleDataId = req.body.googleDataId;
  var vetName = req.body.vetName;
  var servicesRef = req.body.servicesRef || [];
  console.log("DATAID: ", req.body.googleDataId);
  var newVet = {
    googleDataId: googleDataId,
    vetName: vetName,
    servicesRef: servicesRef
  };

  Vet.findOneAndUpdate({ googleDataId: newVet.googleDataId }, newVet, {
    upsert: true
  })
    .then(vet => res.status(201).json(vet))
    // vet => res.status(201).redirect('/vets/vet/'+ vet._id))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post('/:id/services', jsonParser, (req, res) => {
  console.log('SERVICETEST', req.body.service, req.body.price);
  Service
    .create({
      _creator:req.params.id, 
      service:req.body.service, 
      price:req.body.price
    })
    .then(service => res.status(201).json(service.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
      });
})

// why doesn't this work w/ Postman ?????
// router.get("/:id/services/:id", jsonParser, (req, res) => {
//   Service.findById(req.params.id)
//     .exec()
//     // .then(() =>{
//     //   console.log(res);
//     //   res
//     // .render(__dirName+'components/vet')
//     // })
//     .then(vet => res.json(service.apiRepr()))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ message: "Internal server error" });
//     });
// });



router.get('/vetlist/:id', (req, res) => {
  Service
    .findById(req.params.id)
    .populate("_creator")
    .exec(function(err, vet){
      if(err){
        console.log(err)
      }
      console.log('VET: ', vet)
    })
    // .then(vet => res.json(vet.apiRepr()))
    // .catch(err => res.status(500).json({message: 'Internal server error' + err}));
});

module.exports = { router };
