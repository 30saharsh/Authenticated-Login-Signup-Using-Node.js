var express = require('express');
const passport = require('passport');
var router = express.Router();
var userModel = require("./users");
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads")
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(14, function (err, buff) {
      const fn = buff.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    })
  }
})


function abc(req , file , cb){
if( file.mimetype ==='image/jpeg' ||  file.mimetype ==='image/jpg'||  file.mimetype ==='image/png' || file.mimetype ==='image/webp' ){
  cb(null,true);
}
else{
  cb(new Error("Tez mt chal!"))
}
    }


const upload = multer({ storage: storage ,fileFilter: abc,   limits: { fileSize: 1 * 1024 * 1024 }})


router.use(express.json());

router.get('/login', function (req, res, next) {
  res.render('login');
});
router.get('/', function (req, res, next) {
  res.render('index');
});
router.get('/nhi', function (req, res, next) {
  res.send("nhi h user");
});
router.get('/profile', isLoggedIn ,function (req, res, next) {
  userModel.findOne({ username: req.session.passport.user }).then(function (loggedinuser) {
    res.render('profile', { loggedinuser });
  })
})
router.get('/read', function (req, res, next) {
  userModel.find().then(function (all) {
    res.render('read', { all });
  })
});
router.post('/register', function (req, res, next) {
  var newUser = new userModel({
    username: req.body.username,
    email: req.body.email
  })
  userModel.register(newUser, req.body.password)
    .then(function (u) {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/profile');
      })
    })
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/nhi'
}), function (req, res, next) { });
router.get('/logout', function (req, res, next) {
  res.logout();
  res.redirect('/');
  // req.layout passport code  
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect('/');
  }
}
router.post('/uploads', upload.single('filenamez'), function (req, res, next) {
  userModel.findOne({ username:req.session.passport.user }).then(function (loggedinuser) {
  loggedinuser.profileimage = req.file.filename;
  loggedinuser.save().then(function(){
    res.redirect("/profile");
  })
  })
});

module.exports = router;