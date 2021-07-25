var express = require('express');
var router = express.Router();
var register = require('../api/register.js');
let login = require('../api/login');
let records = require('../api/recordSongs')
let recommend = require('../api/recommend')
let recordPlayList = require('../api/recordPlayList')
let analysis = require('../api/analysis')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', (req, res) => register(req, res));

router.post('/login', (req, res) => login(req, res));

router.post('/makerecords', (req, res) => records(req, res))

router.post('/recommend', (req, res) => recommend(req, res))

router.post('/recordplaylist', (req, res) => recordPlayList(req, res))

router.post('/analysis', (req, res) => analysis(req, res))

module.exports = router;
