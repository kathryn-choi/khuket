/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('buyers', {
		buyer_index: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		buyer_id: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true
		},
		buyer_pw: {
			type: DataTypes.STRING(300),
			allowNull: false
		},
		buyer_email: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		buyer_contact: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			unique: true
		},
		buyer_account: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		buyer_name: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		buyer_notification: {
			type: DataTypes.STRING(300),
			allowNull: true
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
		tableName: 'buyers'
	});
};
