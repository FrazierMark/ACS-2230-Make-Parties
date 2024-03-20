'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('Events', 'imgUrl', {
			type: Sequelize.STRING,
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('Events', 'imgUrl');
	},
};
