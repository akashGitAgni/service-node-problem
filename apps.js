var express = require('express');
var app = express();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var uristring = 'mongodb://localhost/customerdatabase';

var superagent = require('superagent')
var agent = superagent.agent();
var acmeUrl = "http://localhost:3050/acme/api/v45.1";
var rainerUrl = "http://localhost:3051/r"

var mockgoose = require('mockgoose');

mockgoose(mongoose);



var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 

mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + uristring);
    }
});

var Schema = mongoose.Schema;

var customer = require('./models/customer');
var orders = require('./models/orders');

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/orders', function (req, res) {
    orders.find(function(error,orderList){
        if(error) {
          return console.error(error);
        }
        res.send(orderList);
    });
  
});

app.post('/order', function (req, res) {
    var make = req.query.make;
    var model = req.query.model;
    var model_package = req.query.package;
    var customer_id = req.query.customer_id;
    var currentDate = new Date();

    var response = make + ' ' + model + ' ' + model_package + ' ' + customer_id;
    console.log(response);

    var order = new orders({
        make: make,
        model: model,
        model_package: model_package,
        customer_id: customer_id,
        created_at: currentDate,
        status: false
    });
    console.log("calling make request." + order.make + '' +order.model);
    makeRequest(order);
    

    res.send(response);

});

function makeRequest(order){
    const SUPPLIER_ACME = "ACME Autos";
    const SUPPLIER_RAINER = "Rainer";
    
    var success = false;
    if(order.make == SUPPLIER_ACME){ 
        console.log("making req to acme");
        superagent.post('/order')
         .send('api_key = cascade.53bce4f1dfa0fe8e7ca126f91b3')
         .send('model = '+ order.model)
         .send('package = '+ order.model_package)
         .end(function(err, res){
                //var orderId = res.order;
                if(err || !res.ok){
                    success = false;
                }else{
                   success = true; 
                }     
         });
    }else if(order.make.localCompare(SUPPLIER_RAINER)){
        console.log("making req to SUPPLIER_RAINER");
        var postToken = 
        superagent.get('/nonce_token')
        .set('storefront', 'ccas-bb9630c04f')
        .end(function(err, res){
            if(!err && res.ok){
                superagent.post('/order')
                .send('api_key = cascade.53bce4f1dfa0fe8e7ca126f91b3')
                .send('model = '+ order.model)
                .send('package = '+ order.model_package)
                .end(function(err, res){
                //var orderId = res.order;
                if(err || !res.ok){
                    success = false;
                }else{
                   success = true; 
                }     
         });
            }
        });
        success = true;
    }

    order.status = success;
    order.save(function (err) {
        if (err) throw err;
        console.log('User created!');
    });

}

app.listen(5353, function () {
    console.log('Example app listening on port 3000!');
});



