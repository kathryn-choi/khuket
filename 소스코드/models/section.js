'use strict';
module.exports = (sequelize, DataTypes) => {
  const section = sequelize.define('section', {
    section_index: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(11)
    },
    gig_index: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    seat_index: {
      allowNull: true,
      type: DataTypes.INTEGER(11)
    },
    seat_price: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    section_id: {
      allowNull: true,
      type: DataTypes.STRING(45)
    }
  }, {});
  section.associate = function(models) {
    // associations can be defined here
  };
  return section;
};