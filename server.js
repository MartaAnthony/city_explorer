'use strict'

const express = require('express');
const app = express();

require('dotenv').config();

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/', (request, response) => {
  console.log('hello out there');
  response.status(200).send('I like pizza');
});

app.get('/location', (request, response) => {
  // query: { city: 'seattle' },
  console.log(request.query.city);
  let search_query = request.query.city;
    
  let geoData = require('./data/location.json');
    
  let returnObj = new Location(search_query, geoData[0]);
    
  console.log(returnObj);
  // let returnObj = {
  //   search_query: search_query,
  //   formatted_query: geoData[0].display_name,
  //   latitude: geoData[0].lat,
  //   longitude: geoData[0].lon
  // }
    
  response.status(200).send(returnObj);

  // // app.get('/bananas', (request, response) => {
  // //   console.log('it is Monday');
  // //   response.status(200).send('tell me about it');
  // // });

  // // app.get('/pizza', (request, response) => {
  // //   response.status(200).send('I am on the pizza route');
  // // });

  // 
    
  //   } catch(err){
  //     console.log('ERROR', err);
  //     response.status(500).send('sorry, we messed up');
  //   }

  // })

  // function Location(searchQuery, obj){
  //   this.search_query = searchQuery;
  //   this.formatted_query = obj.display_name;
  //   this.latitude = obj.lat;
  //   this.longitude = obj.lon;
  // }

  // app.get('*', (request, response) => {
  //   response.status(404).send('sorry, this route does not exist');
  // })

  // // turn on the lights - move into the house - start the server
  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
})
