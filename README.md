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

# CS3216 2015/16 Assignment 3 Group 01
Get your time right with TIMI!
timiapp.me

Evan Sebastian | A0112054Y
Sharon Lynn | A0112171Y
Patricia Wong Xi Wei | A0099112H
Liu Yang | A0133920N

Contributions:

Evan Sebastian: Front and Back End Developer (Main Developer)

Created the front end.
Checked the back end.
Implemented Google authentication, cache, etc.

Sharon Lynn: Project Manager

Managed Trello and documentation.
Helped with front end.
Implemented NUSMods processing.

Patricia Wong Xi Wei: Designer

Designed the logo, thus branding.
Designed the page layouts.
Provided the colour palette.

Liu Yang: Back End Developer

Created REST API.
Implemented TIMI's schedule processing.
