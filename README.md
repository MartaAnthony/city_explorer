# city_explorer

**Author**: Marta Anthony
**Version**: 1.5.0 

## Overview
The application is a stand-alone back end which interacts with a static front end. It requests data from a total of six third-party APIs, modifies the data, and sends the data to the client to be displayed in the browser. It provides data for the City Explorer Application, allowing a user to search for a location, present a Map, as well as interesting information about the area, all using data from APIs that the server will fetch and manage.

## Getting Started
Set up the repository.    
Create a new route that invokes a function to convert the search query to a latitude and longitude. Return an object with correct information to render the map of searched location.     
Create another route for weather information. The returned information will display the weather forecast on different days.

## Architecture
JavaScript
Node.js
Express
SQL
Postgres


## Change Log

06-08-2020 5:30pm - Application now has a location and weather route, and a 500 error messages embedded in case the user submits invalid query.
06-10-2020 6:26 - Application is saving and retrieving the search results in postgres database
06-11-2020 5:43 - Application is connected to Movies DB and Yelp APIS

## Credits and Collaborations

Chance Harmon!


![Whiteboard day 8](img/Whiteboarding with Chris.jpeg)
![Whiteboard day 9]