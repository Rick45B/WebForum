"use strict";

import App from './app.js';

/*const endNav = document.querySelector('#endpageNavigator');
const sideBar = document.querySelector('#sidebar');
const mainMenu = document.querySelector('#main-menu');*/

const body = document.querySelector('#body');
const footer = document.querySelector('#footer');

//creating the App
const app = new App(body, footer);

window.App = app;   //makes it usable in the templates