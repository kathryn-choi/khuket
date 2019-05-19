'use strict';
module.exports = (sequelize, DataTypes) => {
  const seat = sequelize.define('seat', {
    seat_index: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(11)
    },
    gig_index: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    section_id: {
      allowNull: true,
      type: DataTypes.STRING(45)
    },
    seat_row_index: {
      allowNull: true,
      type: DataTypes.INTEGER(11)
    }
  }, {});
  seat.associate = function(models) {
    // associations can be defined here
  };
  return seat;
};