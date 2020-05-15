var express = require('express');
var passport = require('passport');
var router = express.Router();
var Article = require("../models/article");
var Comment = require("../models/comment");
var Tag = require("../models/tag");
var User = require("../models/user");
/* GET home page. */
router.get('/', function(req, res) {
  console.log('HERE');
  console.log(req.session);
  // Get an array of flash messages by passing the key to req.flash()
  Tag.find({}, (err, tags) =>{
    if(err)
        return next(err);
    if(req.session.userId){
      User.findById(req.session.userId, (err, user) => {
        if(err)
          return next(err);
        return res.render('index', {tags: tags, user: user, isUser: true});
      }) 
    }
    else
      return res.render('index', {tags: tags,isUser: false});
  });
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github',
  {failureRedirect:'/failure'}), (req, res, next) =>{
    console.log(res);
    return res.redirect('/articles');
  })
module.exports = router;
