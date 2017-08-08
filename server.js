const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require('express-session');

const {DATABASE_URL, TEST_DATABASE_URL, PORT} = require('./config');
const {User} = require('./models/user');
const {routes} = require('./routes/index');

mongoose.Promise = global.Promise;
// assert.equal(query.exec().constructor, global.Promise);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.get('/api/*', (req, res) => {
// res.json({ok: true});
// });

app.use(session({
    secret: "asdgasgsafhsdhh",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   // res.locals.error = req.flash("error");
   // res.locals.success = req.flash("success");
   next();
});

app.use('/', routes);

let server;


function runServer(databaseUrl) {
	const port = process.env.PORT || 8080;
	const options = {
		useMongoClient: true
		}
	return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, options, err => {
      server = app.listen(port, () => {
       console.log(`Your app is listening on port ${port}`);
       resolve(server);
     }).on('error', err => {
      mongoose.disconnect();
      reject(err)
    });
   });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

// app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app, runServer, closeServer};

