// Inicializa Sequelize y modelos
import { sequelize } from '../config/database';
import User from './user';
import Note from './note';
import Like from './like';

User.hasMany(Note, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'notes',
});
Note.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

User.belongsToMany(Note, { through: Like, foreignKey: 'userId', as: 'likedNotes '});
Note.belongsToMany(User, { through: Like, foreignKey: 'noteId', as: 'likedBy' });
Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Note, { foreignKey: 'noteId' });
User.hasMany(Like, { foreignKey: 'userId' });
Note.hasMany(Like, { foreignKey: 'noteId' });

export { Note, User, sequelize };