// Inicializa Sequelize y modelos
//import { sequelize } from '../config/database';
import { User } from './user';
import { Post } from './post';
import { Like } from './like';
import { Comment } from './comment';
import { PostMedia } from './postMedia';

// Users y Post
User.hasMany(Post, { sourceKey: 'id', foreignKey: 'userId', as: 'posts' }); // sourceKey: 'id' -> la clave primaria
Post.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'author' }); // foreignKey: 'userId' -> la clave foránea en Post

// Users y Comments
User.hasMany(Comment, { sourceKey: 'id', foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'author' });

// Posts y Comments
Post.hasMany(Comment, { sourceKey: 'id', foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', targetKey: 'id', as: 'post' });

// Likes y Posts
Post.hasMany(Like, { sourceKey: 'id', foreignKey: 'postId', as: 'likes' });
Like.belongsTo(Post, { foreignKey: 'postId', targetKey: 'id', as: 'post' });

// Likes y Comments
Comment.hasMany(Like, { sourceKey: 'id', foreignKey: 'commentId', as: 'likes' });
Like.belongsTo(Comment, { foreignKey: 'commentId', targetKey: 'id', as: 'comment' });

// Users y likes
User.hasMany(Like, { sourceKey: 'id', foreignKey: 'userId', as: 'likes' });
Like.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });

// Posts y PostMedias
Post.hasMany(PostMedia, { sourceKey: 'id', foreignKey: 'postId', as: 'media' });
PostMedia.belongsTo(Post, { foreignKey: 'postId', targetKey: 'id', as: 'post' });

// Exportar los modelos con Sequelize
export {
    User,
    Post,
    PostMedia,
    Like,
    Comment,
    //sequelize,
};