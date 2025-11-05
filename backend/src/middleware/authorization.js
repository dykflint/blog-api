// backend/src/middleware/authorization.js
import prisma from '../prisma/client.js';

/**
 * Middleware to check if the current user is the author of the post
 * or has admin privileges.
 */
export async function authorizePostOwner(req, res, next) {
  try {
    const postId = req.params.id;

    // Find the post in the database
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    // If the post doesn't exist
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // If the user is an admin, always allow
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // If the user is the post's author, allow
    if (post.authorId === req.user.userId) {
      return next();
    }

    // Otherwise, deny access
    return res.status(403).json({ error: 'You are not authorized to modify this post' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}
