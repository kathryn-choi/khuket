/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('administrators', {
		admin_index: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		admin_id: {
			type: DataTypes.STRING(45),
			allowNull: false,
			unique: true
		},
		admin_pw: {
			type: DataTypes.STRING(300),
			allowNull: false
		},
		admin_email: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		admin_contact: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		admin_name: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		salt: {
			type: DataTypes.STRING(100),
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
		tableName: 'administrators'
	});
};
