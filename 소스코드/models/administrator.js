'use strict';
module.exports = (sequelize, DataTypes) => {
  const administrator = sequelize.define('administrator', {
    admin_index: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    admin_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING(45)
    },
    admin_pw: {
      allowNull: false,
      type: DataTypes.STRING
    },
    admin_email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true
      },
      primaryKey: true
    },
    admin_contact: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    admin_account: {
      allowNull: false,
      type: DataTypes.BIGINT(20)
    },
    admin_name: {
      allowNull: false,
      type: DataTypes.STRING(45)
    },
    salt: {
      type: DataTypes.STRING
    }
    }, {});
  administrator.associate = function(models) {
    // associations can be defined here
  };
  return administrator;
};