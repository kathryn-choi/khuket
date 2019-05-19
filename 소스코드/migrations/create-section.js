'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sections', {
      section_index: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11)
      },
      gig_index: {
        allowNull: false,
        type: Sequelize.INTEGER(11)
      },
      seat_index: {
        allowNull: true,
        type: Sequelize.INTEGER(11)
      },
      seat_price: {
        allowNull: false,
        type: Sequelize.INTEGER(11)
      },
      section_id: {
        allowNull: true,
        type: Sequelize.STRING(45)
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('sections');
  }
};