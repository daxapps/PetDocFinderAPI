const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const VetSchema = mongoose.Schema({
  googleDataId: String, //google's place id
  vetName: String,
  servicesRef: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Services" 
  }]
});

VetSchema.methods.apiRepr = function() {
  return {
    googleDataId: this.place_id,
    vetName: this.name,
    servicesRef: service._id
  };
};

const ServicesSchema = mongoose.Schema({
  _creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Vet" 
    }, //will be the vet id???? not user?
  service: String,
  price: Number
});

ServicesSchema.methods.apiRepr = function() {
  return {
    _creator: user._id,
    service: this.service,
    price: this.price
  };
};

// UserSchema.methods.validatePassword = function(password) {
//   return bcrypt.compare(password, this.password);
// }

// UserSchema.statics.hashPassword = function(password) {
//   return bcrypt.hash(password, 10);
// }

const Vet = mongoose.model("Vet", VetSchema);
const Services = mongoose.model("Services", ServicesSchema);

module.exports = { Vet, Services };
