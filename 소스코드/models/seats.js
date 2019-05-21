/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('seats', {
		seat_index: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		gig_index: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		section_id: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		seat_row_index: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'seats'
	});
};
