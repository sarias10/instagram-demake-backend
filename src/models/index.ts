// Inicializa Sequelize y modelos
//import { sequelize } from '../config/database';
import { User } from './user';
import { Note } from './note';
import { Like } from './like';
import { Comment } from './comments';

// Users y Notes
User.hasMany(Note, { sourceKey: 'id', foreignKey: 'userId', as: 'notes' }); // sourceKey: 'id' -> la clave primaria
Note.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'author' }); // foreignKey: 'userId' -> la clave foránea en Note

// Users y Comments
User.hasMany(Comment, { sourceKey: 'id', foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'author' });

// Notes y Comments
Note.hasMany(Comment, { sourceKey: 'id', foreignKey: 'noteId', as: 'comments' });
Comment.belongsTo(Note, { foreignKey: 'noteId', targetKey: 'id', as: 'note' });

// Comments (Auto-relación)
Comment.hasMany(Comment, { sourceKey: 'id', foreignKey: 'parentId', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', targetKey: 'id', as: 'parent' });

// Likes y Notes
Note.hasMany(Like, { sourceKey: 'id', foreignKey: 'noteId', as: 'likes' });
Like.belongsTo(Note, { foreignKey: 'noteId', targetKey: 'id', as: 'note' });

// Likes y Comments
Comment.hasMany(Like, { sourceKey: 'id', foreignKey: 'commentId', as: 'likes' });
Like.belongsTo(Comment, { foreignKey: 'commentId', targetKey: 'id', as: 'comment' });

// Users y likes
User.hasMany(Like, { sourceKey: 'id', foreignKey: 'userId', as: 'likes'});
Like.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });

// Exportar los modelos con Sequelize
export {
    User,
    Note,
    Like,
    Comment,
    //sequelize,
  };