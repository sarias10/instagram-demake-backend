'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
    // Agregar comandos de alteración aquí
        await queryInterface.createTable('Users', { // OJO: createTable para crear tablas y createDatabase para crear bases de datos como la de test
            id: { // Automaticamente se pone allownull igual a false
                type: Sequelize.INTEGER, // Tambien se puede importar DATATYPES de sequelize
                autoIncrement: true, // En la base de datos aparece un por defecto igual a nextval('"Users_id_seq"'::regclass) que se encarga de hacer el autoincremento
                primaryKey: true
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            visible: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            createdAt: { // Sino se pone aquí entonces no aparece creado en la base de datos
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: { // Sino se pone aquí entonces no aparece creado en la base de datos
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    async down (queryInterface, _Sequelize) {
    // El guion bajo (_) en _Sequelize indica que el parámetro es requerido
        // por la firma de la función, pero no se utiliza en el cuerpo de esta.
        // Esto ayuda a evitar advertencias de ESLint por variables no usadas.
    // Agregar comandos de reversión aquí
        await queryInterface.dropTable('Users');
    }
};
