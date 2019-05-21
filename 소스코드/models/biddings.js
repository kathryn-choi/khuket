/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('biddings', {
		bidding_index: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		current_time: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		starting_time: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: '0000-00-00 00:00:00'
		},
		ticket_owner_id: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		max_price: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		current_price: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		bidder_id: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		ticket_id: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		starting_price: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		end_time: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: '0000-00-00 00:00:00'
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
		tableName: 'biddings'
	});
};
