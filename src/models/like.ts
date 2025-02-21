import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { LikeAttributes, LikeCreationAttributes } from '../types/types';
import { User } from './user';
import { Note } from './note';
import { Comment } from './comments';

// La clase 'Like' extiende 'Model' de Sequelize para representar la tabla 'Likes' en la base de datos.
// 'Model<LikeAttributes, LikeCreationAttributes>' especifica los tipos para los atributos del modelo
// y los atributos necesarios para crear un nuevo registro.
// - 'LikeAttributes': Define todas las propiedades que el modelo tiene, incluidas las opcionales como 'id', 'createdAt' y 'updatedAt'.
// - 'LikeCreationAttributes': Define las propiedades requeridas para crear un nuevo registro (excluye 'id', 'createdAt' y 'updatedAt').
// 'implements LikeAttributes' asegura que la clase cumple con la estructura definida en la interfaz 'LikeAttributes'.
// Esto obliga a la clase a tener todas las propiedades definidas en la interfaz, ayudando a mantener consistencia de tipos.

// < > son generics en TypeScript para especificar tipos reutilizables.
// Cuando creas un nuevo registro, no sabes el id ni las fechas de creación/actualización, ya que la base de datos las genera automáticamente. Por eso, LikeCreationAttributes no incluye esos campos.

// Sobre implements:
// implements se usa para enforzar que una clase siga la estructura definida por una interfaz.
// Al hacer createdAt obligatorio en la interfaz, implements espera que esté en la clase, pero no exige que lo pases al crear el objeto.
class Like extends Model<LikeAttributes, LikeCreationAttributes> implements LikeAttributes{
    public id!: number; // Utiliza '!' para indicar a TypeScript que esta propiedad siempre tendrá un valor (nunca será undefined o null),
                        // aunque no se inicialice en el constructor. Se usa en clases que extienden de Model, ya que Sequelize asigna el valor después.
    public userId!: number;
    public noteId: number | null = null; // Inicializa noteId como null para evitar que sea undefined y cumplir con la interfaz LikeAttributes, que espera number o null.
    public commentId: number | null = null; // // Si comento esta linea el implements da error porque es un atributo obligatorio
    public readonly createdAt?: Date; // Si comento esta linea el implements no da error porque es un atributo opcional
    public readonly updatedAt?: Date; // Si comento esta linea el implements no da error porque es un atributo opcional
}

// Like.init({...}):
// El método .init() en Sequelize se utiliza para inicializar un modelo y definir la estructura de su tabla en la base de datos.
// A diferencia de la forma tradicional de definir modelos en Sequelize (con 'sequelize.define'),
// init() permite utilizar clases de ES6 y extenderlas de Model, brindando una forma más organizada y orientada a objetos de definir modelos.
// En este caso, 'Like' extiende de Model y se inicializa con los atributos y opciones especificadas.

Like.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        },
        noteId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Note,
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        commentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Comment,
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        }
    },
    {
        sequelize,
        tableName: 'Likes',
        modelName: 'Like',
        timestamps: true, // Sequelize agrega automáticamente 'createdAt' y 'updatedAt'
        // Estos indices son a nivel de base de da datos. La base de datos rechaza automáticamente la inserción duplicada.
        indexes: [ // Se definen índices para optimizar consultas y asegurar unicidad
            {
                unique: true, // Se asegura que un usuario no pueda dar más de un like a la misma nota
                fields: ['userId', 'noteId'], // Índice único para (userId, noteId)
            },
            {
                unique: true, // Se asegura que un usuario no pueda dar más de un like al mismo comentario
                fields: ['userId', 'commentId'], // Índice único para (userId, commentId)
            },
        ],

        // Estas validaciones son a nivel de la aplicación se validan antes de insertar o actualizar un registro en la base de datos
        // Se agrega la validación personalizada aquí
        validate: { // Sequelize permite agregar un objeto de validación personalizado.
            onlyOneReference() { // Es una función de validación personalizada. Se ejecuta automáticamente antes de guardar el registro.
                // Verifica que solo uno de los dos campos tenga un valor
                // Si ambos (noteId y commentId) tienen valores, lanza un Error.
                // Si ninguno tiene valor (ambos son null), también lanza un Error.
                // Solo permite uno de los dos (noteId o commentId), pero nunca ambos ni ninguno.
                if(( this.noteId && this.commentId) || (!this.noteId && !this.commentId)) {
                    throw new Error('Debe tener noteId o commentId, pero no ambos ni ninguno.');
                }
            }
        }
    }
);

export { Like };