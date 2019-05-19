'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('seats', {
      seat_index: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11)
      },
      gig_index: {
        allowNull: false,
        type: Sequelize.INTEGER(11)
      },
      section_id: {
        allowNull: true,
        type: Sequelize.STRING(45)
      },
      seat_row_index: {
        allowNull: true,
        type: Sequelize.INTEGER(11)
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
    return queryInterface.dropTable('seats');
  }
};