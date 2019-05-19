'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('administrators', {
      admin_index: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      admin_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(45)
      },
      admin_pw: {
        allowNull: false,
        type: Sequelize.STRING
      },
      admin_email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          isEmail: true
        },
        primaryKey: true
      },
      admin_contact: {
        allowNull: false,
        type: Sequelize.INTEGER(11)
      },
      admin_account: {
        allowNull: false,
        type: Sequelize.BIGINT(20)
      },
      admin_name: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      salt: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('administrators');
  }
};