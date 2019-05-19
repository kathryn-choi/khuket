'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('notifications', {
      notification_index: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11)
      },
      notice_buyer_id: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      notice_buyer_text: {
        allowNull: false,
        type: Sequelize.STRING(300)
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('notifications');
  }
};