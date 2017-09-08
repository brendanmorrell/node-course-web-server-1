const express = require('express');
const hbs = require('hbs')
//creates an app with express
var expressApp = express();
const fs = require('fs')


//process is a native function (i think), env in the terminal shows all the terminal native computer command variables, and port is the one for the port
const port = process.env.PORT || 3000;
expressApp.listen(port, () =>{
  console.log(`server is listening on port ${port}`);
});



hbs.registerPartials(__dirname+'/views/partials')
//sets hbs as the view engine for all your files run on this server.
//hbs is a module that helps us set how things look across pages in a dynamic way
expressApp.set('view engine', 'hbs');
//set the file that this server js will be accessing using express middleware
//need to use full file name for this, but __dirname accesses the full extension of the current file and puts it in
expressApp.use(express.static(__dirname+'/public'));
//  ~.use is how you register middleware. it takes a function. the 'next' argument lets you tell express when your function is done
expressApp.use( (req, res, next) => {
  var now = new Date().toString();
  var log = (`${now} ${req.method} ${req.url}`)
  console.log(`${log}`)
  fs.appendFile('server.log', log + '\n',(err) => {
    if (err) {
      console.log('Unable to append to server log')
    }
  });
  next();
});

//maintenance page
/*expressApp.use( (req, res, next) => {
  res.render('maintenance.hbs');
});*/

//a helper is essentially an inline partial that allows you to run a function
//arg1=name of helper, arg2=function to run
hbs.registerHelper('getYear',() =>{
  return new Date().getFullYear();
})

hbs.registerHelper('allCaps', (text) => {
  return text.toUpperCase();
});

//use the 'get' handler to show what hhttp command you want (get info)
//here in the parentheses you set up the handler for the http get request
//first argument is url, second is the function you want to run, i.e. what you want to send back to the person who made the request
//when you use the inline curly braces, and don't include the partial syntac '> ', handlebars will first look for a helper, and if none exists, will then look for that data in the object being loaded, so no special syntax needed
expressApp.get('/bad', (req, res) => {
  res.send({
    error: 'this is a page that is incorrect'
  })
});

expressApp.get('/about', (req, res) => {
  //specify a second argument to pass in data that will be dynamically rendered in hbs files
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

expressApp.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: "Home Page",
    welcomeMessage:"Here is a welcome message",
    //this 'getYear' will not render because the helper 'getYear' will be found first
    getYear: "2000000000"
  });
});

expressApp.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: "Projects"
  });
});

expressApp.get('/test-page', (req, res) => {
  res.render('testNestedPage.hbs', {
    pageTitle:"Now we have a dynamic page title"
  });
});
