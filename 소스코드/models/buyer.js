'use strict';
module.exports = (sequelize, DataTypes) => {
  const buyer = sequelize.define('buyer', {
    buyer_index: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(11)
    },
    buyer_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING(45)
    },
    buyer_pw: {
      allowNull: false,
      type: DataTypes.STRING
    },
    buyer_email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true
      },
      primaryKey: true
    },
    buyer_contact: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER(11)
    },
    buyer_account: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.BIGINT(20)
    },
    buyer_name: {
      allowNull: false,
      type: DataTypes.STRING(45)
    },
    buyer_notification: {
      type: DataTypes.STRING(300)
    },
    salt: {
      type: DataTypes.STRING
    }
  }, {});
  buyer.associate = function(models) {
    // associations can be defined here
  };
  return buyer;
};