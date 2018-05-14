const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// For Heroku deployement
const PORT =  process.env.PORT || 3000;

// Create express app
const app = express();

// Set Handlebars partials folder location
    hbs.registerPartials(__dirname + '/views/partials');
    app.set('view engine', 'hbs');

// Middleware
    app.use((req, res, next) => {
        let now = new Date().toString();
        let log = `${now}:${req.method} ${req.url}`
        
        console.log(log);

        // Add log to file
        fs.appendFile('server.log', log + '\n', (err) => {
            if(err){
                console.log('Unable to append to server.log');
            };
        });

        next(); /* next() required to move forward after middleware */
    });

    // app.use((req, res, next) => {
    //     res.render('maintenance');
    //     // If next() is not called everything after this middleware will not be executed
    // })

    app.use(express.static(__dirname + '/public')); /* Setting up public folder */

// Register Handlebars helper
    hbs.registerHelper('getCurrentYear', () => {
        return new Date().getFullYear();
    });

    hbs.registerHelper('screamIt', (text) => {
        return text.toUpperCase();
    });

// Setting routes
    app.get('/',(req, res) => {
        res.render('index',{ pageName: 'Home page', welcomeMsg: 'Welcome YOW' })
    });

    app.get('/about',(req, res) => {
        res.render('about.hbs', { pageName: 'About page'});
    });

    app.get('/bad',(req, res) => {
        res.send({errorMessage: 'Error handling request'});
    })

// Binding app to port and starting server
app.listen(PORT,() => {
    console.log(`Server started at port ${PORT}`);
});