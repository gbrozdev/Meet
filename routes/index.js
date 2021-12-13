var express = require('express');
var router = express.Router();
var fun = require('../functions')
var db = require('../connection')
var ObjectId = require('mongodb').ObjectId


/* GET home page. */
router.get('/admin', function(req, res) {
  db.get().collection('rooms').remove()
  db.get().collection('users').remove()
  res.send("<div> <h1>cleaned up , beginning is the end, and the end is the beginning - 2019 Noha</h1> <a href='/'>Home</a> </div>");
});


router.get('/', async function (req, res) {
  if (req.session) {
    let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user) })
    res.render('index', { user,userin:true });
  } else {
    res.render('index');
  }
});
router.get('/profile', async function (req, res) {
  let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user) })
  res.render('profile', { user });
});



router.get('/signup', (req, res) => {
  if (req.session.signupstatusfalse) {
    res.render('signup', { err: true })
  } else
    res.render('signup')
})

router.post('/signup', (req, res) => {
  fun.doSignup(req.body).then((response) => {
    if (response.signupstatus) {
      session = req.session;
      session.user = response.insertedId
      session.loggedfalse = false
      session.loggedIN = true
      res.redirect('/')
    } else {
      req.session.signupstatusfalse = true
      res.redirect('/signup/')
    }
  })
})

router.get('/login', function (req, res) {
  console.log(req.session);
  if (req.session.loggedIN) {
    res.redirect('/')
  }
  if (req.session.loggedfalse) {
    res.render('login', { err: true });
  } else {
    res.render('login');
  }
});

router.post('/login', (req, res) => {
  fun.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = String(response.user._id)
      req.session.loggedfalse = false
      req.session.loggedIN = true
      res.redirect('/users/')
    } else {
      req.session.loggedfalse = true

      res.redirect('/login');
    }
  })
})

router.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/');
});


module.exports = router;
