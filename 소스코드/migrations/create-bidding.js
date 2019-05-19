'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('biddings', {
      bidding_index: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11)
      },
      current_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      starting_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      ticket_owner_id: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      max_price: {
        allowNull: false,
        type: Sequelize.INTEGER(11)
      },
      current_price: {
        allowNull: false,
        type: Sequelize.INTEGER(11)
      },
      bidder_id: {
        allowNull: true,
        type: Sequelize.STRING(45)
      },
      ticket_id: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      starting_price: {
        allowNull: false,
        type: Sequelize.INTEGER(11)
      },
      end_time: {
        allowNull: false,
        type: Sequelize.DATE
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
    return queryInterface.dropTable('biddings');
  }
};