const bcrypt = require('bcrypt');

module.exports = function (app, models) {
	const jwt = require('jsonwebtoken');

	function generateJWT(user) {
		const mpJWT = jwt.sign({ id: user.id }, 'AUTH-SECRET', {
			expiresIn: 60 * 60 * 24 * 60,
		});

		return mpJWT;
	}

	// Signup (GET)
	app.get('/sign-up', (req, res) => {
		res.render('sign-up-index');
	});

	// Signup (POST)
	app.post('/sign-up', (req, res) => {
		models.User.create(req.body)
			.then(() => {
				const mpJWT = generateJWT(req.body);
				res.cookie('mpJWT', mpJWT);
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
	app.post('/login', async (req, res, next) => {
		try {
			// look up user with email
			const user = await models.User.findOne({
				where: { email: req.body.email },
			});
			if (!user) {
				return res.redirect('/login');
			}

			// compare passwords
			const isMatch = await bcrypt.compare(req.body.password, user.password);

			// if not match send back to login
			if (!isMatch) {
				return res.redirect('/login');
			}

			// if is match generate JWT
			const mpJWT = generateJWT(user);

			// save jwt as cookie
			res.cookie('mpJWT', mpJWT, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
			});

			res.redirect('/');
		} catch (error) {
			console.error(error);
			res.redirect('/login');
		}
	});

	// LOGOUT
	app.get('/logout', (req, res, next) => {
		res.clearCookie('mpJWT');

		req.session.sessionFlash = {
			type: 'success',
			message: 'Successfully logged out!',
		};
		// comment the above line in once you have error messaging setup (step 15 below)
		return res.redirect('/');
	});
};
