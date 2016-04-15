var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var customerSchema = new Schema({
    name: String,
    customer_id: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: String,
    pincode: String,
    created_at: Date,
    updated_at: Date
});
// the schema is useless so far
// we need to create a model using it
var customer = mongoose.model('customer', customerSchema);

// make this available to our users in our Node applications
module.exports = customer;
