'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('organizers', {
      organizer_index: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      organizer_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      organizer_pw: {
        allowNull: false,
        type: Sequelize.STRING
      },
      organizer_email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        },
        primaryKey: true
      },
      organizer_contact: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      organizer_account: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      organizer_name: {
        allowNull: false,
        type: Sequelize.STRING
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
    return queryInterface.dropTable('organizers');
  }
};