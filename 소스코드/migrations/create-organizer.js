'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('organizers', {
      organizer_index: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11)
      },
      organizer_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(45)
      },
      organizer_pw: {
        allowNull: false,
        type: Sequelize.STRING
      },
      organizer_email: {
        type: Sequelize.STRING(45),
        allowNull: false,
        validate: {
          isEmail: true
        },
        primaryKey: true
      },
      organizer_contact: {
        allowNull: false,
        type: Sequelize.INTEGER(11)
      },
      organizer_account: {
        allowNull: false,
        type: Sequelize.BIGINT(20)
      },
      organizer_name: {
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
    return queryInterface.dropTable('organizers');
  }
};