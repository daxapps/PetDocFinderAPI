const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const ServiceSchema = mongoose.Schema({
  _creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Vet" 
    },
  service: String,
  price: String // or Number????
});

ServiceSchema.methods.apiRepr = function() {
  return {
    _creator: vet._id,
    service: this.service,
    price: this.price
  };
};

const Service = mongoose.model("Service", ServiceSchema);

module.exports = { Service };
