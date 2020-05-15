var passport = require("passport");
var GitHubStrategy = require('passport-github').Strategy;
var User = require("../models/user");
passport.use(new GitHubStrategy({
    clientID: process.env.Client_ID,
    clientSecret: process.env.Client_Secret ,
    callbackURL: "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOne({ email: profile.emails[0].value }, function (err, user) {
      if(err)
        return cb(err);
      if(!user){
        console.log('User not found. Creating new');
        let newUser = {email: profile.emails[0].value, name: profile.displayName, password:"password"}; 
        User.create(newUser, (err, user) =>{
          console.log('User created');
          // console.log(user);
          if(err)
            return cb(err);
          return cb(null, user);

        });
      }
      else
        return cb(null, user);
      
    }); 
  }
));
passport.serializeUser((user, cb) => {
  // console.log(user);
  cb(null, user.id)
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if(err)
      cb(err);
    cb(null, user);
  });
});