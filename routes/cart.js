var express = require('express');
var router = express.Router();
var models = require('../models')
var wrap = require('../wrap')
const { v4: uuid } = require('uuid');
var sanateError = require('../exception/sanateError')

const Cart = models.sanate_cart
const User = models.sanate_user
const Products = models.sanate_product

router.get('/:u_id', wrap(async function(req, res) {
  const { u_id } = req.params

  if (!u_id) {
    throw sanateError('MISSING_PARAMS', 400, 'MISSING_PARAMS')    
  }

  const cart = await Cart.getByUId(u_id)

  if(!cart) {
    return res.send({})
  }

  var productList = JSON.parse("[" + cart.products + "]");
  const products = await Products.findByPIds(productList)
  
  return res.send(products)
}));

router.put('/', wrap(async function(req, res) {
    const { u_id, p_id } = req.body
  
    if (!u_id || !p_id) {
      throw sanateError('MISSING_PARAMS', 400, 'MISSING_PARAMS')    
    }
  
    const user = await User.getByUId(u_id)
  
    if(!user) {
        throw sanateError('UNKNOWN_USER', 400, 'UNKNOWN_USER')    
    }

    const product = await Products.getByPId(p_id)
  
    if(!product) {
        throw sanateError('UNKNOWN_PRODUCT', 400, 'UNKNOWN_PRODUCT')    
    }
    
    const cart = await Cart.getByUId(u_id)

    if(!cart) {
        const newCart = await Cart.create({ u_id, status:'CURRENT', products:p_id})
        return res.send(newCart)
    }

    cart.products = cart.products + ',' + p_id
    cart.save()
    
    return res.send(cart)
  }));

module.exports = router;
