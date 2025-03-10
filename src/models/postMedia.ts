import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { PostMediaAttributes, PostMediaCreationAttributes } from '../types/types';
import { Post } from './post';

class PostMedia extends Model<PostMediaAttributes, PostMediaCreationAttributes> implements PostMediaAttributes {
    public id!: number;
    public postId!: number;
    public mediaUrl!: string;
    public mediaType!: 'image' | 'video';
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
}

PostMedia.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Post,
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        mediaUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mediaType: {
            type: DataTypes.ENUM('image', 'video'),
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'PostMedias',
        modelName: 'PostMedia',
        timestamps: true,
    }
);

export { PostMedia };