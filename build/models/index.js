"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = exports.Like = exports.PostMedia = exports.Post = exports.User = void 0;
// Inicializa Sequelize y modelos
//import { sequelize } from '../config/database';
const user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
const post_1 = require("./post");
Object.defineProperty(exports, "Post", { enumerable: true, get: function () { return post_1.Post; } });
const like_1 = require("./like");
Object.defineProperty(exports, "Like", { enumerable: true, get: function () { return like_1.Like; } });
const comment_1 = require("./comment");
Object.defineProperty(exports, "Comment", { enumerable: true, get: function () { return comment_1.Comment; } });
const postMedia_1 = require("./postMedia");
Object.defineProperty(exports, "PostMedia", { enumerable: true, get: function () { return postMedia_1.PostMedia; } });
// Users y Post
user_1.User.hasMany(post_1.Post, { sourceKey: 'id', foreignKey: 'userId', as: 'posts' }); // sourceKey: 'id' -> la clave primaria
post_1.Post.belongsTo(user_1.User, { foreignKey: 'userId', targetKey: 'id', as: 'author' }); // foreignKey: 'userId' -> la clave foránea en Post
// Users y Comments
user_1.User.hasMany(comment_1.Comment, { sourceKey: 'id', foreignKey: 'userId', as: 'comments' });
comment_1.Comment.belongsTo(user_1.User, { foreignKey: 'userId', targetKey: 'id', as: 'author' });
// Posts y Comments
post_1.Post.hasMany(comment_1.Comment, { sourceKey: 'id', foreignKey: 'postId', as: 'comments' });
comment_1.Comment.belongsTo(post_1.Post, { foreignKey: 'postId', targetKey: 'id', as: 'post' });
// Likes y Posts
post_1.Post.hasMany(like_1.Like, { sourceKey: 'id', foreignKey: 'postId', as: 'likes' });
like_1.Like.belongsTo(post_1.Post, { foreignKey: 'postId', targetKey: 'id', as: 'post' });
// Likes y Comments
comment_1.Comment.hasMany(like_1.Like, { sourceKey: 'id', foreignKey: 'commentId', as: 'likes' });
like_1.Like.belongsTo(comment_1.Comment, { foreignKey: 'commentId', targetKey: 'id', as: 'comment' });
// Users y likes
user_1.User.hasMany(like_1.Like, { sourceKey: 'id', foreignKey: 'userId', as: 'likes' });
like_1.Like.belongsTo(user_1.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
// Posts y PostMedias
post_1.Post.hasMany(postMedia_1.PostMedia, { sourceKey: 'id', foreignKey: 'postId', as: 'media' });
postMedia_1.PostMedia.belongsTo(post_1.Post, { foreignKey: 'postId', targetKey: 'id', as: 'post' });
