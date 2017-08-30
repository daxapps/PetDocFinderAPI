const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const { Vet } = require("./models");
const { Service } = require("../services/models");

const router = express.Router();

const jsonParser = bodyParser.json();

// Post Vet info
router.post("/vetlist", jsonParser, (req, res) => {
  var googleDataId = req.body.googleDataId;
  var vetName = req.body.vetName;
  var servicesRef = req.body.servicesRef || [];
  // var vetId = req.body.vetId
  console.log("DATAID: ", req.body.googleDataId);
  var newVet = {
    googleDataId: googleDataId,
    vetName: vetName
    // servicesRef: servicesRef will reset to []
  };

  Vet.findOne({ googleDataId: googleDataId })
    .exec()
    .then(vet => {
      console.log("VET: ", vet);
      if (vet) {
        Vet.findByIdAndUpdate(vet._id, { $set: newVet }, { new: true })
          .exec()
          .then(vet => {
            console.log("RESSTATUS: ", vet);
            return res.status(201).json(vet);
          });
      } else {
        Vet.create(newVet).then(vet => vet);
      }
    })
    // .then(vet => {
    //   console.log("RESSTATUS: ", vet);
    //   return res.status(201).json(vet);
    // })
    // vet => res.status(201).redirect('/vets/vet/'+ vet._id))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post("/:id/services", jsonParser, (req, res) => {
  console.log("SERVICETEST", req, req.body);
  let newService;
  Service.create({
    _creator: req.params.id,
    service: req.body.service,
    price: req.body.price
  })
    .then(service => {
      newService = service;
      return Vet.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { servicesRef: { _id: service._id } } },
        { safe: true, upsert: true }
      );
    })
    .then(data => res.status(201).json(newService))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.get("/vetlist/:id", (req, res) => {
  Vet.findById(req.params.id).populate("servicesRef").exec(function(err, vet) {
    if (err) {
      console.log(err);
    }
    console.log("VET: ", vet);
    res.json(vet);
  });
  // .then(vet => res.json(vet.apiRepr()))
  // .catch(err => res.status(500).json({message: 'Internal server error' + err}));
});

module.exports = { router };
