/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('notifications', {
		notification_index: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		notice_buyer_id: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		notice_buyer_text: {
			type: DataTypes.STRING(300),
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
		tableName: 'notifications'
	});
};
