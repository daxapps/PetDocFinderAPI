const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const VetSchema = mongoose.Schema({
  googleDataId: String, //google's place id
  vetName: String,
  servicesRef: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Service" 
  }]
});

VetSchema.methods.apiRepr = function() {
  console.log('PLACE_ID: ', this.place_id)
  return {
    googleDataId: this.place_id,
    vetName: this.name,
    servicesRef: service._id
  };
};

const Vet = mongoose.model("Vet", VetSchema);

module.exports = { Vet };
