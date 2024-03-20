// Initialize express
const express = require('express');
const app = express();

// Middleware

// Allow Express (our web framework) to render HTML templates and send them back to the client using a new function
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const {
	allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

const hbs = handlebars.create({
	// Specify helpers which are only registered on this instance.
	helpers: {
		foo() {
			return 'FOO!';
		},
		bar() {
			return 'BAR!';
		},
	},
	defaultLayout: 'main',
	handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// BODY-PARSER
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Models
const models = require('./db/models');

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

// Routes

// Index
app.get('/', (req, res) => {
	models.Event.findAll({ order: [['createdAt', 'DESC']] }).then((events) => {
		res.render('events-index', { events: events });
	});
});

// New Event Route
app.get('/events/new', (req, res) => {
	res.render('events-new', {});
});

// Create Event Route
app.post('/events', (req, res) => {
	models.Event.create(req.body)
		.then((event) => {
			// Redirect to events/:id
			res.redirect(`/events/${event.id}`);
		})
		.catch((err) => {
			console.log(err);
		});
});

// Show Event Route
app.get('/events/:id', (req, res) => {
	// Search for the event by its id that was passed in via req.params
	models.Event.findByPk(req.params.id)
		.then((event) => {
			// If the id is for a valid event, show it
			res.render('events-show', { event: event });
		})
		.catch((err) => {
			// if they id was for an event not in our db, log an error
			console.log(err.message);
		});
});

// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
	console.log('App listening on port 3000!');
});
