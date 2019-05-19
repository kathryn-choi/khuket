'use strict';
module.exports = (sequelize, DataTypes) => {
  const gig = sequelize.define('gig', {
    gig_index: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(11)
    },
    gig_organizer_index: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    gig_venue: {
      allowNull: true,
      type: DataTypes.STRING(200)
    },
    gig_name: {
      allowNull: false,
      type: DataTypes.STRING(200)
    },
    gig_date_time: {
      allowNull: false,
      type: DataTypes.DATE
    },
    gig_total_seatnum: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    pending: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    gig_image: {
      allowNull: true,
      type: DataTypes.STRING(500)
    },
    gig_description: {
      allowNull: true,
      type: DataTypes.STRING
    },
    gig_type: {
      allowNull: false,
      type: DataTypes.STRING(45)
    }
  }, {});
  gig.associate = function(models) {
    // associations can be defined here
  };
  return gig;
};