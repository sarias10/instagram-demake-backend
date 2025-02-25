import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { CommentAttributes, CommentCreationAttributes } from '../types/types';
import { User } from './user';
import { Note } from './note';

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    public id!: number;
    public content!: string;
    public userId!: number;
    public noteId!: number;
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
            allowNull: false,
            references: {
                model: Note,
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        }
    },
    {
        sequelize,
        tableName: 'Comments',
        modelName: 'Comment',
        timestamps: true,
    }
);

export { Comment };