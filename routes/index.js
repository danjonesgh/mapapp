var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});

router.post('/test', function(req, res) {
  console.log('next post');
  console.log(req.body);
  res.send('done');
});

module.exports = router;
