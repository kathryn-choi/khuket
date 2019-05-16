'use strict';
module.exports = (sequelize, DataTypes) => {
  const buyer = sequelize.define('buyer', {
    buyer_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    buyer_pw: {
      allowNull: false,
      type: DataTypes.STRING
    },
    buyer_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      primaryKey: true
    },
    buyer_contact: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    buyer_account: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    buyer_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    buyer_notification: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {});
  buyer.associate = function(models) {
    // associations can be defined here
  };
  return buyer;
};