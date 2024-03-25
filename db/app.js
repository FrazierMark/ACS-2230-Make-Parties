// Initialize express
const express = require('express');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const app = express();

// Middleware

// Allow Express to render HTML templates and send them back to the client using a new function
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const {
	allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

const hbs = handlebars.create({
	defaultLayout: 'main',
	handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Body-Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//override with Post having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'));

// Cookie Parser
app.use(cookieParser('SECRET'));
const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 60); // 60 days

app.use(
	session({
		secret: 'SUPER_SECRET_SECRET',
		cookie: { expires: expiryDate },
		resave: false,
	})
);

// Custom Flash Middleware
app.use(function(req, res, next){
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

// Authentication
app.use(function authenticateToken(req, res, next) {
	// Gather the jwt access token from the cookie
	const token = req.cookies.mpJWT;

	if (token) {
		jwt.verify(token, 'AUTH-SECRET', (err, user) => {
			if (err) {
				console.log(err);
				// redirect to login if not logged in and trying to access a protected route
				res.redirect('/login');
			}
			req.user = user;
			next(); // pass the execution off to whatever request the client intended
		});
	} else {
		next();
	}
});

// Create CurrentUser object - Custom middleware
app.use(req, res, (next) => {
	// if a valid JWT token is present
	if (req.user) {
		// Look up the user's record
		models.User.findByPk(req.user.id)
			.then((currentUser) => {
				// make the user object available in all controllers and templates
				res.locals.currentUser = currentUser;
				next();
			})
			.catch((err) => {
				console.log(err);
			});
	} else {
		next();
	}
});

// Models
const models = require('./db/models');

// Routes
require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);
require('./controllers/auth')(app, models);

// Mock Data
let events = [
	{
		title: 'I am your first event',
		desc: 'A great event that is super fun to look at and good',
		imgUrl:
			'https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn',
	},
	{
		title: 'I am your second event',
		desc: 'A great event that is super fun to look at and good',
		imgUrl:
			'https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn',
	},
	{
		title: 'I am your third event',
		desc: 'A great event that is super fun to look at and good',
		imgUrl:
			'https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn',
	},
];

// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
	console.log('App listening on port 3000!');
});
