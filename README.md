# Capstone: Restaurant Reservation System

## Live Site
[Periodic Tables Restaurant Reservation System](https://front-end-three-kappa.vercel.app/dashboard)

## Summary
This application demonstrates a system that is used to keep track of reservations and table assignments for a restaurant called Periodic Tables. The user can create new reservations, update reservations, seat guests, and search for existing reservations by a customer's mobile number. It allows for monitoring reservations as to which tables they are seated and which tables are unavailable at specific times.

## Technology Used

This application is developed with JavaScript, React, Node, Express, PostgreSQL, KnexJS, HTML, CSS, and BootStrap. 

## API Documentation

| Route           | Method    | Status Code | Description                                                                      |
| --------------- | ----------|-------------|--------------------------------------------------------------------------------- |
|/reservations    | GET       | 200         | Returns a list of reservations for the current date                              |
|/reservations    | POST       | 201         | creates a new reservation                              |
|/reservations?date=###-##-##    | GET       | 200         | Returns a list of reservations for a specific date                              |
|/reservations/:reservation_id    | GET       | 200         | Returns a reservation for the given ID                              |
|/reservations/:reservation_id    | PUT       | 200         | Updates a reservation for the given ID                              |
|/reservations/:reservation_id/status    | PUT       | 200         | Updates the status of the reservation of the given ID                              |
|/tables   | GET       | 200         | Returns a list of tables                              |
|/tables   | POST     | 201         | Creates a new table                              |
|/tables/:table_id   | GET       | 200         | Returns a table for the given table ID                              |
|/tables/:table_id/seat   | PUT       | 200         | Seats reservation at the given table ID                             |
|/tables/:table_id/seat   | DELETE      | 200         | Deletes the occupied status of the table and changes it back to free for the given table ID                            |

## Installation

#### Install dependencies:
``` npm install ```

#### Starting the server and web page:
``` npm start ```

#### Connecting to a database by creating .env files

##### Backend:
```
//Connects to database
DATABASE_URL=enter-your-production-database-url-here
DATABASE_URL_DEVELOPMENT=enter-your-development-database-url-here
DATABASE_URL_TEST=enter-your-test-database-url-here
DATABASE_URL_PREVIEW=enter-your-preview-database-url-here
LOG_LEVEL=info
```
##### Frontend:
```
//Connects to server
REACT_APP_API_BASE_URL=http://localhost:5000
```
