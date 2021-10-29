var express = require('express');
var router = express.Router();
var models = require('../models')
var wrap = require('../wrap')
const { v4: uuid } = require('uuid');
var sanateError = require('../exception/sanateError')

const Product = models.sanate_product

router.get('/', wrap(async function(req, res) {

  const product = await Product.findAll()
  
  return res.send(product)
}));

router.patch('/', wrap(async function(req, res) {
    const { p_id, name, price, availability, description } = req.body

    if (!p_id || !name || !price || !availability || !description) {
        throw sanateError('MISSING_PARAMS', 400, 'MISSING_PARAMS')    
    }
    
    const product = await Product.getByPId(p_id)

    if(!product) {
        throw sanateError('PRODUCT_NOT_FOUND', 400, 'PRODUCT_NOT_FOUND')    
    }

    product.name = name
    product.price = price
    product.availability = availability
    product.description = description
    product.save()
    
    return res.send(product)
  }));

module.exports = router;
