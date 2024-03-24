// Initialize express
const express = require('express');
const methodOverride = require('method-override');
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

// Models
const models = require('./db/models');

// Routes
require('./controllers/events')(app, models);

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
