'use strict';
const crypto = require("crypto");
module.exports = {
  up: (queryInterface, Sequelize) => {
  
  let data = [];
  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let inputPassword = "admin";
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  let obj = {
    admin_id: "admin",
    admin_pw: hashPassword,
    admin_email: "admin@admin.com",
    admin_contact: 1012341234,
    admin_account: 3333048390799,
    admin_name: "administrator",
    salt: salt,
    createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  }
  data.push(obj)

  return queryInterface.bulkInsert('administrators', data, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('administrators', null, {});
  }
};
