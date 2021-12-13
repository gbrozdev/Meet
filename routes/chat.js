var express = require('express');
var router = express.Router();
var db = require('../connection')
var ObjectId = require('mongodb').ObjectId


router.get('/', async function (req, res) {
  // var userchats = await db.get().collection('chats').find({userid:ObjectId(req.session.user)}).toArray()
  let query = {userid:ObjectId(req.session.user)} 
  let obj = {$set : {"style":"media-chat-reverse","you":"You"}}
  db.get().collection('chats').updateMany(query,obj)
  let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user)})
  var chats = await db.get().collection('chats').find().toArray()
  let obj1 = {$set : {"style":"","you":""}}
  db.get().collection('chats').updateMany(query,obj1)
  console.log(chats);
  res.render('chat',{chats,user});
  });


  
  router.get('/single/:chater', async function (req, res) {
    let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user)})
    let chater = req.params.chater
    let chaters = [user.name,chater]
    chaters = sorting(chaters)
    let query = {userid:ObjectId(req.session.user),"chaters":chaters} 
    let obj = {$set : {"style":"media-chat-reverse","you":"You"}}
    db.get().collection('single').updateMany(query,obj)
    var chats = await db.get().collection('single').find({"chaters":chaters}).toArray()
    console.log(chats);
    res.render('single',{user,chater,chats});
    let obj1 = {$set : {"style":"","you":""}}
    db.get().collection('single').updateMany(query,obj1)
    });
  router.get('/single', async function (req, res) {
    let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user)})
    let chater = req.session.chater
    let chaters = [user.name,chater]
    chaters = sorting(chaters)
    let query = {userid:ObjectId(req.session.user),"chaters":chaters} 
    let obj = {$set : {"style":"media-chat-reverse","you":"You"}}
    db.get().collection('single').updateMany(query,obj)
    var chats = await db.get().collection('single').find({"chaters":chaters}).toArray()
    console.log(chats);
    res.render('single',{user,chater,chats});
    let obj1 = {$set : {"style":"","you":""}}
    db.get().collection('single').updateMany(query,obj1)
    });

  function sorting(array) {
    array.sort(function(a, b){
      var nameA=a.toLowerCase(), nameB=b.toLowerCase();
      if (nameA < nameB) //sort string ascending
       return -1;
      if (nameA > nameB)
       return 1;
      return 0; //default return value (no sorting)
     });
     return array;
  }
  
router.post('/single', async function (req, res) {

    let msg = req.body
    msg.time = new Date().toLocaleTimeString()
    msg.date = new Date().toLocaleDateString()
    var user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user)})
    let chaters = [user.name,msg.chater]
    console.log(chaters);
    req.session.chater = msg.chater
    chaters = sorting(chaters)
     console.log(chaters);
    if (user) {
      msg.user = user.name
      msg.userid = user._id
      msg.chaters = chaters
    }else{
      msg.chaters = chaters
      msg.user = 'anonymous'
    }
    console.log(msg);
    db.get().collection('single').insertOne(msg)
    res.redirect('/chat/single/');
  });
router.post('/', async function (req, res) {
    let msg = req.body
    msg.time = new Date().toLocaleTimeString()
    msg.date = new Date().toLocaleDateString()
    var user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user)})
    if (user) {
      msg.user = user.name
      msg.userid = user._id
    }else{
      msg.user = 'anonymous'
    }
    console.log(msg);
    db.get().collection('chats').insertOne(msg)
    res.redirect('/chat');
  });

module.exports = router;

