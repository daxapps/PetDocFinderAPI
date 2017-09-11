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
        // console.log("RESSTATUS: ", vet);
        return res.status(201).json(vet);
      } else {
        Vet.create(newVet).then(vet => {
          return res.status(201).json(vet);
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// Add service to vet
router.post("/:id/services", jsonParser, (req, res) => {
  console.log("SERVICETEST", {
    _creator: req.params.id,
    service: req.body.service,
    price: req.body.price
  });

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

// Edit a service
router.put("/:id/services", jsonParser, (req, res) => {
  console.log("REQBODY: ", req.body, req.params.id);
  const service = req.body.service,
    price = req.body.price;
  Service.findByIdAndUpdate(req.params.id, {
    $set: {
      service: service,
      price: price
    }
  })
    .then(data => {console.log('--->',data); return res.status(200).json(data);})
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// Delete a service
router.delete("/:id/services", (req, res) => {
  // remove service from service collection
  console.log("REQID: ", req.params.id);
  Service.findById(req.params.id)
    // remove reference to service from vet collection
    .then(service => {
      console.log("CREATOR: ", service._creator, service._id);
      const serviceCreator = service._creator,
        serviceId = service._id;
      service.remove();
      return Vet.findByIdAndUpdate(
        serviceCreator,
        { $pull: { servicesRef: serviceId } },
        { safe: true, upsert: true }
      );
    })
    // .then(() => Service.findByIdAndRemove(req.params.id))
    .then(() => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

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
