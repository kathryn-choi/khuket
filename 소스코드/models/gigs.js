/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('gigs', {
		gig_index: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		gig_organizer_index: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'organizers',
				key: 'organizer_index'
			}
		},
		gig_venue: {
			type: DataTypes.STRING(200),
			allowNull: false
		},
		gig_name: {
			type: DataTypes.STRING(200),
			allowNull: false
		},
		gig_date_time: {
			type: DataTypes.DATE,
			allowNull: false
		},
		gig_total_seatnum: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		pending: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		gig_image: {
			type: DataTypes.STRING(30000),
			allowNull: false
		},
		gig_description: {
			type: DataTypes.STRING(300),
			allowNull: false
		},
		gig_type: {
			type: DataTypes.STRING(45),
			allowNull: false
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
		tableName: 'gigs'
	});
};
