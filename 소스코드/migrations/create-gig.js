'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('gigs', {
      gig_index: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11)
      },
      gig_organizer_index: {
        allowNull: false,
        type: Sequelize.INTEGER(11)
      },
      gig_venue: {
        allowNull: true,
        type: Sequelize.STRING(200)
      },
      gig_name: {
        allowNull: false,
        type: Sequelize.STRING(200)
      },
      gig_date_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      gig_total_seatnum: {
        allowNull: false,
        type: Sequelize.INTEGER(11)
      },
      pending: {
        allowNull: false,
        type: Sequelize.INTEGER(11)
      },
      gig_image: {
        allowNull: true,
        type: Sequelize.STRING(500)
      },
      gig_description: {
        allowNull: true,
        type: Sequelize.STRING
      },
      gig_type: {
        allowNull: false,
        type: Sequelize.STRING(45)
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
    return queryInterface.dropTable('gigs');
  }
};