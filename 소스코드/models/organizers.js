/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('organizers', {
		organizer_index: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		organizer_id: {
			type: DataTypes.STRING(45),
			allowNull: false,
			unique: true
		},
		organizer_pw: {
			type: DataTypes.STRING(300),
			allowNull: false
		},
		organizer_email: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		organizer_contact: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		organizer_account: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		organizer_name: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		salt: {
			type: DataTypes.STRING(100),
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
		tableName: 'organizers'
	});
};
