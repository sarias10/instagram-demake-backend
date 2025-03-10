'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('Posts', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false
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

        // Agrega un índice en la columna 'userId' de la tabla 'Posts'.
        // Esto mejora el rendimiento de las consultas que buscan posts
        // por el 'userId', como cuando se obtiene una lista de notas de un usuario específico.
        // No es un índice único, por lo que puede haber múltiples notas con el mismo 'userId'.
        await queryInterface.addIndex('Posts', [ 'userId' ]);
    },

    async down (queryInterface, _Sequelize) {
        await queryInterface.dropTable('Posts');
    }
};
