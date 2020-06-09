'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/', (request, response) => {
  console.log('oh hello');
  response.status(200).send('I like WA');
});

//get location

app.get('/location', (request, response) => {

  try{

    console.log(request.query.city);
    let search_query = request.query.city;

    let geoData = require('./data/location.json');

    let returnObj = new Location(search_query, geoData[0]);

    console.log(returnObj);

    response.status(200).send(returnObj);

  } catch(err){
    console.log('ERROR', err);
    response.status(500).send('sorry, something went wrong');
  }

})


function Location(searchQuery, obj){
  this.search_query = searchQuery;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}


//get weather

app.get('/weather', (request, response) => {

  try{
    
    let search_query = request.query.search_query;

    let weatherData = require('./data/weather.json');
    let weatherArr = weatherData.data.map(value => new Weather(value));

    response.status(200).send(weatherArr);

  }catch(err){
    console.log('ERROR', err);
    response,status(500).send('oopsy daisy, something went wrong');
  }
})

function Weather(obj){
  this.forecast = obj.weather.description;
  this.time = obj.datetime;
}



app.get('*', (request, response) => {
  response.status(404).send('sorry, this route does not exist');
})

// // turn on the lights - move into the house - start the server
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

