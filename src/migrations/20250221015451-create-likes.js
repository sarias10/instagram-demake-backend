'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('Likes', {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // Nombre de la tabla relacionada
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            postId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Posts', // Nombre de la tabla relacionada
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            commentId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Comments', // Nombre de la tabla relacionada
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });

        // Agregar la restricción CHECK para que al menos uno de los dos (postId o commentId) no sea NULL
        await queryInterface.sequelize.query(`
            ALTER TABLE "Likes"
            ADD CONSTRAINT "likes_postId_commentId_check"
            CHECK (
                ("postId" IS NOT NULL AND "commentId" IS NULL) OR
                ("postId" IS NULL AND "commentId" IS NOT NULL)
            );
        `);

        // Agrega un índice único en las columnas 'userId' y 'postId' de la tabla 'Likes'.
        // Esto garantiza que un usuario no pueda dar más de un like a la misma nota,
        // ya que la combinación de 'userId' y 'postId' debe ser única en toda la tabla.
        // Si se intenta insertar un registro con la misma combinación que ya existe,
        // se producirá un error de duplicado, preservando así la integridad de los datos.
        // Optimiza el rendimiento de las consultas compuestas y la de userId porque es el primer valor del indice
        // pero no optimiza la de postId.
        await queryInterface.addIndex('Likes', [ 'userId', 'postId' ], {
            unique: true,
        });
        await queryInterface.addIndex('Likes', [ 'userId', 'commentId' ], {
            unique: true,
        });
    },

    async down (queryInterface, _Sequelize) {
        await queryInterface.dropTable('Likes');
    }
};
