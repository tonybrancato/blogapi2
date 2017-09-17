const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const {DATABASE_URL, PORT} = require('./config');
const {BlogPost} = require('./models');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

app.get('/posts', (req, res) => {
	BlogPost
		.find()
		.then(posts => {
			res.json(posts.map(post => post.aprRepr()));
			});
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal Server Error'})
		});
})

app.get('/posts/:id', (req, res) =>{
	.findById(req.params.id)
	.then(post =>res.json(apiRepr()))
	.catch(err => {
		console.error(err);
			res.status(500).json({message: 'Internal Server Error'})
	});
});
/*
app.post('/posts', (req, res) => {
	const requiredFields = ['title'. 'content', 'author'];
	for (let i = 0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	BlogPost
		.create({
			titl
		})
})
*/
let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
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

module.exports = {app, runServer, closeServer};