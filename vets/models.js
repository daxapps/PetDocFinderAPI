const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const VetSchema = mongoose.Schema({
  // vetId: String,
  googleDataId: String, //google's place id
  vetName: String,
  servicesRef: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Service" 
  }]
});

VetSchema.methods.apiRepr = function() {
  console.log('PLACE_ID: ', this)
  return {
    // vetId: this._id,
    googleDataId: this.googleDataId,
    vetName: this.vetName,
    servicesRef: this.servicesRef
  };
};

const Vet = mongoose.model("Vet", VetSchema);

module.exports = { Vet };
