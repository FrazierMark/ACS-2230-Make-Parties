module.exports = function (app, models) {


  // Signup (GET)
  app.get('/sign-up', (req, res) => {
    res.render('sign-up-index');
  });

  // Signup (POST)
  app.post('/signup', (req, res) => {
    models.User.create(req.body)
      .then((user) => {
        res.redirect('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // Login (GET)
  app.get('/login', (req, res) => {
    res.render('login-index');
  });

	// LOGIN (POST)
	app.post('/login', (req, res, next) => {
		// look up user with email
		models.User.findOne({ where: { email: req.body.email } }).then((user) => {
			// compare passwords
			user
				.comparePassword(req.body.password, function (err, isMatch) {
					// if not match send back to login
					if (!isMatch) {
						return res.redirect('/login');
					}
					// if is match generate JWT
					const mpJWT = generateJWT(user);
					// save jwt as cookie
					res.cookie('mpJWT', mpJWT);

					res.redirect('/');
				})
				.catch((err) => {
					// if  can't find user return to login
					console.log(err);
					return res.redirect('/login');
				});
		});
	});
};
