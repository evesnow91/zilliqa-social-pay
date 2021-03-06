'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Twittes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idStr: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      rejected: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      claimed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      txId: {
        type: Sequelize.STRING
      },
      block: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: 0
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
    return queryInterface.dropTable('Twittes');
  }
};