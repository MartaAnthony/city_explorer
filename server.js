/* eslint-disable no-trailing-spaces */
'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const app = express();

app.use(cors());

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

const PORT = process.env.PORT || 3001;

app.get('/', (request, response) => {
  console.log('oh hello');
  response.status(200).send('I like WA');
});

//get location


app.get('/location', (request, response) => {
  try {

    let city = request.query.city;
    let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`;

    //check if the location is already in database
    let sqlQuery = 'SELECT * FROM location WHERE search_query = $1;'
    let safeValue = [city];

    client.query(sqlQuery, safeValue)
      .then(sqlResults => {
        console.log(sqlResults);
        // if in database, send back the results
        if (sqlResults.rowCount) {
          console.log('getting info from the database');
          response.status(200).send(sqlResults.rows[0]);
          //if not in database, fetch results from the API
        } else {
          superagent.get(url)
            .then(resultsFromSuperAgent => {
              let finalObj = new Location(city, resultsFromSuperAgent.body[0]);
              console.log('getting info from API');

              //add results from the API to the database
              let sql = 'INSERT INTO location(search_query, formatted_query, longitude, latitude) VALUES ($1, $2, $3, $4)';
              let safeValues = [city, finalObj.formatted_query, finalObj.longitude, finalObj.latitude];
              client.query(sql, safeValues)

              response.status(200).send(finalObj);
            })
        }})

  }
  catch(err){
    console.log('ERROR', err);
    response.status(500).send('oopsy daisy, something went wrong');
  }

})

function Location(searchQuery, obj){
  this.search_query = searchQuery;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

//get movies

app.get('/movies', (request, response) => {
  let search_query = request.query.search_query;
  console.log('stuff I got from the front end on the movies route', search_query);

  let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${search_query}`;

  superagent.get(url)
    .then(moviesData => {
      console.log(moviesData);
      let moviesArr = moviesData.body.results.map(value => new Movie(value));
      response.status(200).send(moviesArr);
    }).catch(err => console.log(err));
})

function Movie(obj){
  this.title = obj.title;
  this.overview = obj.overview;
  this.average_votes = obj.vote_average;
  this.total_votes = obj.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${obj.poster_path}`;
  this.popularity = obj.popularity;
  this.released_on = obj.release_date;
}


app.get('/yelp', (request, response) => {
  let search_query = request.query.search_query;
  console.log('stuff I got from the front end on the yelp route', search_query);

  let url = 'https://api.yelp.com/v3/businesses/search';

  const yelpQuery = request.query.page;
  const numPerPage = 5; 
  const start = (yelpQuery - 1) * numPerPage;

  const queryParams = {
    latitude: request.query.latitude,
    start: start,
    count: numPerPage,
    longitude: request.query.longitude
  }

  superagent.get(url)
  .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
  .query(queryParams)
    .then(yelpData => {
      console.log(yelpData.body);
      let yelpArr = yelpData.body.businesses.map(value => new Restaurant(value));
      response.status(200).send(yelpArr);
    }).catch(err => console.log(err));
})

function Restaurant(obj){
  this.name = obj.name;
  this.image_url = obj.image_url;
  this.price = obj.price;
  this.rating = obj.rating;
  this.url = obj.url;
}


//get weather

app.get('/weather', (request, response) => {
  let search_query = request.query.search_query;
  // console.log('stuff I got from the front end on the weather route', search_query);


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
  // console.log('stuff I got from the front end on the trails route', search_query);

  let url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&key=${process.env.TRAIL_API_KEY}`;

  superagent.get(url)
    .then(trailsData => {
      // console.log(trailsData.body.trails);
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
client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    });
  })
