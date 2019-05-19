'use strict';
module.exports = (sequelize, DataTypes) => {
  const bidding = sequelize.define('bidding', {
    bidding_index: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(11)
    },
    current_time: {
      allowNull: false,
      type: DataTypes.DATE
    },
    starting_time: {
      allowNull: false,
      type: DataTypes.DATE
    },
    ticket_owner_id: {
      allowNull: false,
      type: DataTypes.STRING(45)
    },
    max_price: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    current_price: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    bidder_id: {
      allowNull: true,
      type: DataTypes.STRING(45)
    },
    ticket_id: {
      allowNull: false,
      type: DataTypes.STRING(45)
    },
    starting_price: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    end_time: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  bidding.associate = function(models) {
    // associations can be defined here
  };
  return bidding;
};