'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/', (request, response) => {
  console.log('oh hello');
  response.status(200).send('I like WA');
});

//get location
try {

  app.get('/location', (request, response) => {
    let city = request.query.city;

    let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`;

    superagent.get(url)
      .then(resultsFromSuperAgent => {
        let finalObj = new Location(city, resultsFromSuperAgent.body[0]);
        response.status(200).send(finalObj);
      }).catch(err => console.log(err))
  })

  // eslint-disable-next-line no-inner-declarations
  function Location(searchQuery, obj){
    this.search_query = searchQuery;
    this.formatted_query = obj.display_name;
    this.latitude = obj.lat;
    this.longitude = obj.lon;
  }
}catch(err){
  console.log('ERROR', err);
  response.status(500).send('oopsy daisy, something went wrong');
}


//get weather

app.get('/weather', (request, response) => {
  let search_query = request.query.search_query;
  console.log('stuff I got from the front end on the weather route', search_query);


  let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${search_query}&key=${process.env.WEATHER_API_KEY}&days=7`;

  superagent.get(url)
    .then(weatherData => {
      // console.log(weatherData.body.data);
      let weatherArr = weatherData.body.data.map(value => new Weather(value));
      response.status(200).send(weatherArr);
    }).catch(err => console.log(err));
})

function Weather(obj){
  this.forecast = obj.weather.description;
  this.time = obj.datetime;
}

// get trails

app.get('/trails', (request, response) => {
  let search_query = request.query.search_query;
  let lat = request.query.latitude;
  let lon = request.query.longitude;
  console.log('stuff I got from the front end on the trails route', search_query);

  let url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&key=${process.env.TRAIL_API_KEY}`;

  superagent.get(url)
    .then(trailsData => {
      console.log(trailsData.body.trails);
      let trailArr = trailsData.body.trails.map(value => new Trail(value));
      response.status(200).send(trailArr);
    }).catch(err => console.log(err));
})

function Trail(obj){
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.starVotes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = `${obj.conditionDetails || ''} ${obj.conditionStatus}`;
  this.condition_date = obj.conditionDate.slice(0, obj.conditionDate.indexOf(' '));
  this.condition_time = obj.conditionDate.slice(obj.conditionDate.indexOf(' ')+1, obj.conditionDate.length);
}


app.get('*', (request, response) => {
  response.status(404).send('sorry, this route does not exist');
})

// // turn on the lights - move into the house - start the server
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

