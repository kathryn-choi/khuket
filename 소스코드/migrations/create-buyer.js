// 자동으로 s가 붙고 DB에도 s가 붙어서 table 생성됨, default 명령어 때문에 어쩔 수 없이 이대로 써야함
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('buyers', { 
      buyer_index: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      buyer_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      buyer_pw: {
        allowNull: false,
        type: Sequelize.STRING
      },
      buyer_email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        },
        primaryKey: true
      },
      buyer_contact: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      buyer_account: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      buyer_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      buyer_notification: {
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
    return queryInterface.dropTable('buyers');
  }
};