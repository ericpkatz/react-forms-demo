const app = require('express').Router();
const models = require('./db').models;

module.exports = app;


app.get('/products', (req, res, next)=> {
  models.Product.findAll({ order: 'name'})
    .then( products => res.send(products ))
    .catch(next);
});

app.post('/products', (req, res, next)=> {
  models.Product.create(req.body)
    .then( product => res.send(product))
    .catch(next);
});
