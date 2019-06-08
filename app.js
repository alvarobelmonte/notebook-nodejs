var express = require('express');
var path = require('path');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var app = express();
var port = process.env.PORT || 5000;
var passport = require('passport');

//Load routes
var ideas = require('./routes/ideas');
var users = require('./routes/users');

//DB COnfig
var db = require('./config/database');

//Passport Config
require('./config/passport')(passport);

//Connect to mongoose
mongoose.connect(db.mongoURI, { useCreateIndex: true, useNewUrlParser: true })
.then(() => {
    console.log('MongoDB connected');
})
.catch(error =>{
    console.log('ERROR AL CONECTAR: ' + error);
});



//Handle bars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//BodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Method-Override middleware
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    var title = 'Notebook App';
    res.render('index', {
        title: title
    });
});


//Express-Session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next(); //goes to next middleware
});

app.get('/about', (req, res) => {
    res.render('about');
});





//Use routes
app.use('/ideas', ideas); 
app.use('/users', users); 

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});