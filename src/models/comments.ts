import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { CommentAttributes, CommentCreationAttributes } from '../types/types';
import { User } from './user';
import { Note } from './note';

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    public id!: number;
    public content!: string;
    public userId!: number;
    public noteId: number | null = null; // Inicializa noteId como null para evitar que sea undefined y cumplir con la interfaz CommentAttributes, que espera number o null.
    public parentId: number | null = null;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
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
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                // No estoy seguro de si dejar Comment o 'Comments'
                model: Comment, // Referencia a sí mismo para comentarios anidados
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        tableName: 'Comments',
        modelName: 'Comment',
        timestamps: true,

        // Se agrega la validación personalizada aquí
        validate: { // Sequelize permite agregar un objeto de validación personalizado.
            onlyOneReference() { // Es una función de validación personalizada. Se ejecuta automáticamente antes de guardar el registro.
                // Verifica que solo uno de los dos campos tenga un valor
                // Si ambos (noteId y parentId) tienen valores, lanza un Error.
                // Si ninguno tiene valor (ambos son null), también lanza un Error.
                // Solo permite uno de los dos (noteId o parentId), pero nunca ambos ni ninguno.
                if(( this.noteId && this.parentId) || (!this.noteId && !this.parentId)) {
                    throw new Error('Debe tener noteId o parentId, pero no ambos ni ninguno.');
                }
            }
        }
    }
);

export { Comment };