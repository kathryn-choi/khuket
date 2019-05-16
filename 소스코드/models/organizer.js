'use strict';
module.exports = (sequelize, DataTypes) => {
  const organizer = sequelize.define('organizer', {
    organizer_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    organizer_pw: {
      allowNull: false,
      type: DataTypes.STRING
    },
    organizer_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      primaryKey: true
    },
    organizer_contact: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    organizer_account: {
      allowNull: false,
      type: DataTypes.BIGINT
    },
    organizer_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    salt: DataTypes.STRING
  }, {});
  organizer.associate = function(models) {
    // associations can be defined here
  };
  return organizer;
};