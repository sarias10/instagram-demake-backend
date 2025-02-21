import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { NoteAttributes, NoteCreationAttributes } from '../types/types';
import { User } from './user';

class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public visible!: boolean;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    }
  },
  {
    sequelize,
    tableName: 'Notes',
    modelName: 'Note',
    timestamps: true,
  }
);

export { Note };
