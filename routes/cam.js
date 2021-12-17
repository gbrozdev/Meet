var express = require('express');
var router = express.Router();
var db = require('../connection')
var fun = require('../functions')


router.get('/', function(req, res) {
  res.render('camera');
});

module.exports = router;
