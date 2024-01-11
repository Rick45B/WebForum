# WebForum

## Description
A small forum-like website developed as part of a web development course at University of Eastern Piedmont.
Developed in javascript, uses nodeJS as its runtime system.

## Installation and usage
Before commencing the installation, please ensure that both NodeJS and NPM are installed on your machine.

Download all the project files, and position yourself inside the source folder. After that, install all the required packages.
To install all the packages required for the server to run, type (inside a terminal):
```
npm ci
```
After all the required dependencies have been installed, run:
```
node ./server.js
```
to run the server. The default listen port is 3000. While the server is running, go on your favourite browser and type localhost:3000 to interact with the website.
All the HTTP requests will be shown in the terminal where the server is running.

Four users have already signed-up: admin, Bob, Alice, Peter. The password is the same for all of them and it is _**password**_.

## Features
* Database sensible data (user password and email) stored in the database using salt hashing and SQLite.
* Basic authentication system using Passport.js
* Session and cookies.
* Independent databases for every user joining the website, containing sensible data.
* Users can upload images and download projects source files.
* People can interact with each other using various features, such as upvote, downvote and comments.
* Fully customizable personal pages for every user.
* Client side routing system with one page architecture.
* Roles and special permissions depending on the role the user has.

