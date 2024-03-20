// Initialize express
const express = require('express');
const app = express();

// Middleware
// Allow Express (our web framework) to render HTML templates and send them back to the client using a new function
const handlebars = require('express-handlebars');

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
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Tell our app to send the "hello world" message to our home page
app.get('/', (req, res) => {
	res.render('home', { msg: 'Handlebars are Cool!' });
});

// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
	console.log('App listening on port 3000!');
});
