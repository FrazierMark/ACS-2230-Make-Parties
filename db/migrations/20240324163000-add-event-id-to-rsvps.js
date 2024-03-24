'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'Rsvps', // name of source model
			'EventId', // name of key we are adding
			{
				type: Sequelize.INTEGER,
				references: {
					//Required field
					model: 'Events',
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}
		);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('Rsvps', 'EventId');
	},
};
