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

######################################

Routes: 
    - POST on /promo to create a promo code with body format:

    {
    "name": "WeatherCode",
    "avantage": { "percent": 20 },
    "restrictions": {
        "@or": [
        {
            "@age": {
            "eq": 40
            }
        },
        {
            "@age": {
            "lt": 30,
            "gt": 15
            }
        }
        ],
        "@date": {
        "after": "2019-01-01",
        "before": "2020-06-30"
        },
        "@meteo": {
        "is": "clear",
        "temp": {
            "gt": "15"
        }
        }
    }
    }


- PUT on /promo to validate a promo code with body format:

    {
    "promocode_name": "Hello",
    "arguments": {
        "age": 25,
        "meteo": { "town": "Lyon" }
    }
    }
