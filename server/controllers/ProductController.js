
var mongoose = require('mongoose');
var Product = mongoose.model('Product');

var error = require('../utils/Error');
var sanitise = require('../utils/Sanitise');


module.exports = {
    //  CREATE PRODUCT
    //  ------------------------
    createProduct: function (req, res) {

        if (req.params.facebookID) {
            var facebookID = sanitise.facebookID(req.params.facebookID);

            var newProductID = req.body.productID ? sanitise.productID(req.body.productID) : null;
            
            Product
                .find	({ fb_id: facebookID,  productID: newProductID })
                .limit(1)
                .exec(function (err, product) {

                    if (err) {
                        error(err);
                    }

                    else {
                        if (product.length <= 0) { //check if existing product exists
                            var product = new Product(req.body);//make new product
                            product.fb_id = facebookID;
                            product.save(function (err, product) {//save said product
                                res.send(200, product);//on success send product
                            });
                        }
                        else {
                            res.send(401, new Error());//send 401
                        }
                    }
                });
        }
        else {
            error();
        }
    },

    //  READ PRODUCTS
    //  ------------------------
    readProduct: function (req, res) {

        if (req.params.facebookID) {
            var facebookID = sanitise.facebookID(req.params.facebookID);//sanitise the input

            //Find all the products that this user has
            Product
                .find({fb_id: facebookID })
                .exec(function (err, product) {
                    if (err) {
                        error(err);
                    }
                    else {
                        res.send(200, product);
                    }
                });
        }

        else {
            res.send(400, new Error('Please use a resource identifier'));
        }


    },

    //  UPDATE PRODUCT
    //  ------------------------
    updateProduct: function (req, res) {

        var facebookID = req.params.facebookID ? sanitise.facebookID(req.params.facebookID) : null;//sanitise the input

        var newProductID = req.body.productID ? sanitise.productID(req.body.productID) : null;
        var newQuantity = req.body.quantity ? sanitise.quantity(req.body.quantity) : null;

        if (facebookID) {
            Product
                .findOne({ fb_id: facebookID , productID: newProductID })
                .exec(function (err, product) {

                    if (err) {
                        error(err, res);
                    }
                    else if (product) {
                    	product.productID = newProductID ? newProductID : product.productID;
                    	product.quantity = newQuantity ? newQuantity : product.quantity;
                    	product.save(function (err, product) {
                            if (err) {
                                error(err, res);
                            }
                            else {
                                res.send(200, product);
                            }
                        });
                    }
                });

        }
        else {
            error(new Error('No FacebookID Provided'), res);
        }

    },

    //  DELETE PRODUCT
    //  ------------------------
    deleteProduct: function (req, res) {
        var facebookID = req.params.facebookID ? sanitise.facebookID(req.params.facebookID) : null;//sanitise the input
        
        var newProductID = req.body.productID ? sanitise.productID(req.body.productID) : null;
        
        if (facebookID && newProductID) {
            Product
            	.findOne({ fb_id: facebookID, productID: newProductID})
            	.exec(function (err, product) {
            		
                if (err) {
                    error(err, res);
                }
                else if (product) {
                	product.remove();
                    res.send(200, {});
                }
                
            });
        }
    }
};