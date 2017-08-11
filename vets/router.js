const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const { Vet } = require("./models");

const router = express.Router();

const jsonParser = bodyParser.json();

// Post Vet info
router.post("/vetlist", jsonParser, (req, res) => {
  var googleDataId = req.body.googleDataId;
  var vetName = req.body.vetName;
  console.log('DATAID: ', req.body.googleDataId)
  var newVet = {
   googleDataId: googleDataId,
   vetName: vetName
  };

  Vet
    .findOneAndUpdate({googleDataId:newVet.googleDataId},newVet,{upsert:true})
    .then(
      vet => res.status(201).json(vet))
      // vet => res.status(201).redirect('/vets/vet/'+ vet._id))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

// router.get('vet/:id', (req,res)=>{ 
//   Vet.findById(id)
//   .exec()
//   .then(() =>{
//     console.log(res); 
//     res
//     .render(__dirName+'components/vet') 
//   }) 
// }



// router.get('/vetlist', (req, res) => {
//   Vet
//     .find()
//     .then(Vets => res.json(Vets.map(vet => vet.apiRepr())))
//     .catch(err => res.status(500).json({message: 'Internal server error'}));
// });

module.exports = { router };
