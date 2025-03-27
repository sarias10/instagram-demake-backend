import { sequelize } from '../config/database';
import { config } from '../config/env';
import { Post, PostMedia, User } from '../models';
import { PostWithMediaAttributes } from '../types/types';
import { CustomSecretValidationError } from './errorFactory';

const awsCloudformationDomain = config.aws.awsCloudformationDomain;

const getPostById = async (loggedUserId: number,postId: number): Promise<PostWithMediaAttributes> => {
    // Traer el post con el username del autor
    const post: PostWithMediaAttributes | null = await Post.findOne({
        attributes: [
            'id',
            'description',
            [
                sequelize.literal(`(
                SELECT CAST(COUNT(*) AS INTEGER)
                FROM "Likes" AS likes
                WHERE likes."postId" = "Post"."id"
            )`), 'likesCount'
            ],
            [
                sequelize.literal(`(
                SELECT CAST(COUNT(*) AS INTEGER)
                FROM "Comments" AS comments
                WHERE comments."postId" = "Post"."id"
            )`), 'commentsCount'
            ],
            [
                sequelize.literal(`(
                SELECT CASE 
                    WHEN COUNT(*) > 0 THEN TRUE 
                    ELSE FALSE 
                END
                FROM "Likes" AS likes
                WHERE likes."postId" = "Post"."id"
                AND likes."userId" = ${loggedUserId}
            )`), 'hasLiked'
            ],
        ],
        // Post del que queremos la información
        where: { id: postId },
        include: [
            {
                model: User,
                as: 'author',
                attributes: [ 'id', 'username' ]
            },
            {
                model: PostMedia,
                as: 'media',
                attributes: [ 'id', 'mediaUrl', 'mediaType' ],
            }
        ]
    });

    if (!post){
        throw new CustomSecretValidationError('complete post is null');
    }

    if (Array.isArray(post.media)) {
        post.media.forEach(media => {
            media.mediaUrl = `https://${awsCloudformationDomain}/${media.mediaUrl}`;
        });
    }

    return post;
};

const getVisiblePosts = async (loggedUserId: number): Promise<PostWithMediaAttributes[]> => {
    const posts: PostWithMediaAttributes[] = await Post.findAll({
        attributes: [
            'id',
            'description',
            [
                sequelize.literal(`(
                SELECT CAST(COUNT(*) AS INTEGER)
                FROM "Likes" AS likes
                WHERE likes."postId" = "Post"."id"
            )`), 'likesCount'
            ],
            [
                sequelize.literal(`(
                SELECT CAST(COUNT(*) AS INTEGER)
                FROM "Comments" AS comments
                WHERE comments."postId" = "Post"."id"
            )`), 'commentsCount'
            ],
            [
                sequelize.literal(`(
                SELECT CASE 
                    WHEN COUNT(*) > 0 THEN TRUE 
                    ELSE FALSE 
                END
                FROM "Likes" AS likes
                WHERE likes."postId" = "Post"."id"
                AND likes."userId" = ${loggedUserId}
            )`), 'hasLiked'
            ],
        ],
        include: [
            {
                model: User,
                as: 'author',
                where: { visible: true },
                attributes: [ 'id','username' ]
            },// Autor del post y solo trae los post de usuarios visibles
            {
                model: PostMedia,
                as: 'media',
                attributes:[ 'id', 'mediaUrl', 'mediaType' ]
            },
        ],
        order: [
            [ 'id', 'desc' ]
        ]
    });

    // Generar URLs usando CloudFront
    posts.forEach(post => {
        if (Array.isArray(post.media)) {
            post.media.forEach(media => {
                media.mediaUrl = `https://${awsCloudformationDomain}/${media.mediaUrl}`;
            });
        }
    });
    return posts;
};

const getPostsFromLoggedUser = async (loggedUserId: number): Promise<PostWithMediaAttributes[]> => {
    const posts: PostWithMediaAttributes[] = await Post.findAll({
        attributes: [
            'id',
            'description',
            [
                sequelize.literal(`(
                SELECT CAST(COUNT(*) AS INTEGER)
                FROM "Likes" AS likes
                WHERE likes."postId" = "Post"."id"
            )`), 'likesCount'
            ],
            [
                sequelize.literal(`(
                SELECT CAST(COUNT(*) AS INTEGER)
                FROM "Comments" AS comments
                WHERE comments."postId" = "Post"."id"
            )`), 'commentsCount'
            ],
            [
                sequelize.literal(`(
                SELECT CASE 
                    WHEN COUNT(*) > 0 THEN TRUE 
                    ELSE FALSE 
                END
                FROM "Likes" AS likes
                WHERE likes."postId" = "Post"."id"
                AND likes."userId" = ${loggedUserId}
            )`), 'hasLiked'
            ],
        ],
        where: { userId: loggedUserId }, // Usuario loggeado: id del usuario que viene en el token
        include: [
            {
                model: User,
                as: 'author',
                attributes: [ 'id', 'username' ]
            }, // Autor del post
            {
                model: PostMedia,
                as: 'media',
                attributes: [ 'id', 'mediaUrl', 'mediaType' ]
            },
        ],
        order: [
            [ 'id', 'desc' ]
        ]
    });

    // Generar URLs usando CloudFront
    posts.forEach(post => {
        if (Array.isArray(post.media)) {
            post.media.forEach(media => {
                media.mediaUrl = `https://${awsCloudformationDomain}/${media.mediaUrl}`;
            });
        }
    });
    return posts;
};

const getVisiblePostsFromUser = async (loggedUserId: number, userIdParam: string): Promise<PostWithMediaAttributes[]> => {
    const posts: PostWithMediaAttributes[] = await Post.findAll({
        attributes: [
            'id',
            'description',
            [
                sequelize.literal(`(
                SELECT CAST(COUNT(*) AS INTEGER)
                FROM "Likes" AS likes
                WHERE likes."postId" = "Post"."id"
            )`), 'likesCount'
            ],
            [
                sequelize.literal(`(
                SELECT CAST(COUNT(*) AS INTEGER)
                FROM "Comments" AS comments
                WHERE comments."postId" = "Post"."id"
            )`), 'commentsCount'
            ],
            [
                sequelize.literal(`(
                SELECT CASE
                    WHEN COUNT(*) > 0 THEN TRUE
                    ELSE FALSE
                END
                FROM "Likes" AS likes
                WHERE likes."postId" = "Post"."id"
                AND likes."userId" = ${loggedUserId}
            )`), 'hasLiked'
            ],
        ],
        include: [
            // Agrego el visible por si algo
            {
                model: User,
                as: 'author',
                where:
                {
                    username: userIdParam, // username del usuario del que queremos obtener sus posts
                    visible: true
                },
                attributes: [ 'id', 'username' ] },
            {
                model: PostMedia,
                as: 'media'
            },
        ],
        order: [
            [ 'id', 'desc' ]
        ]
    });

    // Generar URLs usando CloudFront
    posts.forEach(post => {
        if (Array.isArray(post.media)) {
            post.media.forEach(media => {
                media.mediaUrl = `https://${awsCloudformationDomain}/${media.mediaUrl}`;
            });
        }
    });

    return posts;
};

export default {
    getPostById,
    getVisiblePosts,
    getPostsFromLoggedUser,
    getVisiblePostsFromUser
};
