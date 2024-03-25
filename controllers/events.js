module.exports = function (app, models) {
	// Routes

	// Index/Home
	app.get('/', (req, res) => {
		console.log(req.user);
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
		models.Event.findByPk(req.params.id, { include: [{ model: models.Rsvp }] })
			.then((event) => {
				let createdAt = event.createdAt;
				createdAt = moment(createdAt).format('MMMM Do YYYY, h:mm:ss a');
				event.createdAtFormatted = createdAt;
				res.render('events-show', { event: event });
			})
			.catch((err) => {
				console.log(err.message);
			});
	});

	// Edit Event Route
	app.get('/events/:id/edit', (req, res) => {
		models.Event.findByPk(req.params.id)
			.then((event) => {
				res.render('events-edit', { event: event });
			})
			.catch((err) => {
				console.log(err.message);
			});
	});

	// Update Event Route (once the edit form is submitted)
	app.put('/events/:id', (req, res) => {
		models.Event.findByPk(req.params.id)
			.then((event) => {
				event
					.update(req.body)
					.then((event) => {
						res.redirect(`/events/${req.params.id}`);
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err);
			});
	});

	// Delete Route
	app.delete('/events/:id', (req, res) => {
		models.Event.findByPk(req.params.id)
			.then((event) => {
				event.destroy();
				res.redirect(`/`);
			})
			.catch((err) => {
				console.log(err);
			});
	});
};
