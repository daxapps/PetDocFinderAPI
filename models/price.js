const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const PriceSchema = new mongoose.Schema({
	userId: String,
    service1: String,
    service2: String,
    service3: String, 
    service4: String, 
    service5: String, 
});

PriceSchema.plugin(passportLocalMongoose);

const Price = mongoose.model('Price', PriceSchema);
module.exports = {Price};