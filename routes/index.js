const express = require('express');
const passport = require('passport');
const {User} = require('../models/user');
const {Qna} = require('../models/qna');
const middleware = require("../middleware/index");
const router = express.Router();
const app = express();

// AUTH ROUTES
//show sign up form
router.get("/register", (req, res) => {
	console.log('Register')
   res.render("register", {page: "register"}); 
});

//handling user sign up
router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to Web Dev Interview Q&A's " + user.username);
			res.redirect("/");
		});
	});
});

// LOGIN ROUTES
//render login form
router.get("/login", (req, res) => {
  res.render("login"); 
});
//login logic middleware
router.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/register"
}) ,function(req, res){
});

router.get("/logout", (req, res) => {
    req.logout();
   	req.flash("success", "Logged you out!");
    // TODO: remove id??
    res.redirect("/"); // retains :id, why??
});

var routes = router;
module.exports = {routes, app};
