'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Notes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Nombre de la tabla relacionada
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    // Agrega un índice en la columna 'userId' de la tabla 'Notes'.
    // Esto mejora el rendimiento de las consultas que buscan notas
    // por el 'userId', como cuando se obtiene una lista de notas de un usuario específico.
    // No es un índice único, por lo que puede haber múltiples notas con el mismo 'userId'.
    await queryInterface.addIndex('Notes', ['userId']);
  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.dropTable('Notes');
  }
};
