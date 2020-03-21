Environment requirements (recommended install via Brew package Manager):

Node 11.5 (min) NPM 6.4.1 (min)
Install info: https://nodejs.org/en

Mongodb 4.2.3
Install info: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

- OPTIONAL - 
Mongo-Express 0.54.0 (if you want a fancy GUI for all your database visualisation needs)
Install info: https://www.npmjs.com/package/mongo-express with config path 'mongodb://localhost/Moviedb''

######################################

Install dependencies with `npm install`

Launch api with command `npm run start`

That's it! 

Though you should probably comment out line 31 & 32 in app.js, it's what populates the movie collection on launch, and creates the contest :) 
