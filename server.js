const express = require('express');
const app = express();
const mongoose = require('mongoose');

const {PORT, DATABASE_URL} = require('./config');

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

