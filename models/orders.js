var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ordersSchema = new Schema({
    model: {type: String, required: true},
    make: {type: String, required: true},
    model_package: {type: String, required: true},
    created_at: Date,
    status: Boolean
});

// the schema is useless so far
// we need to create a model using it
var orders = mongoose.model('orders', ordersSchema);

// make this available to our users in our Node applications
module.exports = orders;