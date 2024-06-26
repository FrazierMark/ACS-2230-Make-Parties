'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Rsvp extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Rsvp.init(
		{
			name: DataTypes.STRING,
			email: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Rsvp',
		}
	);
	Rsvp.associate = function (models) {
		Rsvp.belongsTo(models.Event); // EventId
	};
	return Rsvp;
};
