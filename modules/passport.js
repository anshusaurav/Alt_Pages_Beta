var passport = require("passport");
var GitHubStrategy = require('passport-github').Strategy;
var User = require("../models/user");
passport.use(new GitHubStrategy({
    clientID: process.env.Client_ID,
    clientSecret: process.env.Client_Secret ,
    callbackURL: "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    User.findOne({ email: profile.email }, function (err, user) {
      
      if(!user){
        let newUser = {email: profile.email, name: profile.name, password:"password"}; 
        User.create(newUser, (err, data) =>{
          // req.session.userId = user.id;
          if(err)
            return cb(err, false);
          return cb(null, data);

        });
      }
      else
        return cb(null, user);
      
    }); 
  }
));
passport.serializeUser((user, cb) => {
    cb(null, user.id)
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if(err)
      cb(err, false);
    cb(err, user);

  });
});