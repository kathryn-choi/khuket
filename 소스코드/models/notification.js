'use strict';
module.exports = (sequelize, DataTypes) => {
  const notification = sequelize.define('notification', {
    notification_index: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(11)
    },
    notice_buyer_id: {
      allowNull: false,
      type: DataTypes.STRING(45)
    },
    notice_buyer_text: {
      allowNull: false,
      type: DataTypes.STRING(300)
    }
  }, {});
  notification.associate = function(models) {
    // associations can be defined here
  };
  return notification;
};