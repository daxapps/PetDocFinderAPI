const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const { Vet } = require("./models");
const { Service } = require("../services/models");

const router = express.Router();

const jsonParser = bodyParser.json();

// Post Vet info from google
router.post("/vetlist", jsonParser, (req, res) => {
  var googleDataId = req.body.googleDataId;
  var vetName = req.body.vetName;
  var servicesRef = [];

  console.log("DATAID: ", req.body);
  var newVet = {
    googleDataId: googleDataId,
    vetName: vetName
  };

  Vet.findOne({ googleDataId: googleDataId })
    .populate("servicesRef")
    .exec()
    .then(vet => {
      console.log("VET: ", vet);
      if (vet) {
        console.log("RESSTATUS: ", vet);
        return res.status(201).json(vet);
      } else {
        Vet.create(newVet).then(vet => vet);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// Add service to vet
router.post("/:id/services", jsonParser, (req, res) => {
  console.log("SERVICETEST", req, req.body);
  let newService;
  Service.create({
    _creator: req.params.id,
    service: req.body.service,
    price: req.body.price
  })
    .then(service => {
      // Connect vet collection to service collection
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

// Delete a service
// /:id/services/:id ????
router.delete("/:id/services"), (req, res) => {
  Service.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
};

// Get all services info for one vet
router.get("/vetlist/:id", (req, res) => {
  Vet.findById(req.params.id).populate("servicesRef").exec(function(err, vet) {
    if (err) {
      console.log(err);
    }
    console.log("VET: ", vet);
    res.json(vet);
  });
});

module.exports = { router };
