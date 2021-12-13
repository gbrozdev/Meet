var express = require('express');
var router = express.Router();
var db = require('../connection')
var fun = require('../functions')

const requiredLogin = (req,res,next)=>{
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET users listing. */


router.get('/', async function(req, res) {
  req.session.url = req.route.path
  var rooms = await db.get().collection('rooms').find({}).toArray()
  res.render('rooms',{rooms});
});

router.get('/room', function(req, res) {
  res.send(req.session.room);
});


router.get('/room/:id', async function(req, res) {
  let roomid = req.params.id
  let room = await db.get().collection('rooms').findOne({room:roomid})
  if (req.session.meeterr) {
    res.render('room',{room,err:true});
  } else {
    res.render('room',{room});
  }
});

router.post('/room', async function(req, res) {
  let roomid = req.body.room
  let room = await db.get().collection('rooms').findOne({room:roomid})
  if(req.body.pswd == room.password){
    req.session.room = roomid
    res.redirect('room');
  }else{
    req.session.meeterr = true
    res.redirect('back')
  }
});

router.get('/create-room',requiredLogin, function(req, res) {

  if (!req.session.roomerr) {
    res.render('create-room')
  } else {
    res.render('create-room',{err:'Room name already in use.'})
  }
});

router.post('/create-room', function(req, res) {
  let room = req.body
  fun.createRoom(room).then((roomstatus)=>{
    if (roomstatus) {
      req.session.room = room.room
      room.admin = req.session.user
      db.get().collection('rooms').insertOne(req.body)
      res.redirect('room')
    } else {
      req.session.roomerr = true
      res.redirect('create-room')
    }
  })
});

module.exports = router;

