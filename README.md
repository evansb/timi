# Timi

Timi is a mobile app that finds your team a meeting time based on your
team's schedule and your defined constraints.

# Prerequisites

* Node.js (>= 0.10)
* NPM (>= 2.3)
* PostgreSQL Server

# Installation Instructions.

1. Clone the repository

2. Install required command line utilities
```
$ npm install -g cordova ionic gulp-cli bower
```
3. Install the API and the Frontend
```
$ cd api && npm install
$ cd ..
$ cd app && npm install && bower install
```
4. To run the API
```
$ cd api && gulp
```
5. To auto-compile the front end changes
```
$ cd app && gulp
```
6. To preview the front end
```
$ ionic serve
```
