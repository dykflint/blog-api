// backend/src/contollers/commentController.js
import prisma from '../prisma/client.js';

// READ COMMENTS
// Get all comments for a specific post
export async function getCommentsForPost(req, res) {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { author: true }, // include author info if needed
      orderBy: { createdAt: 'asc' },
    });
    return res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ error: 'Failed to fetch comments' });
  }
}

// CREATE COMMENTS
// Create a new comment for a post
export async function createComment(req, res) {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId; // Comes frmo JWT auth

  if (!content) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  try {
    // Check if post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        author: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
      include: { author: true },
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create comment' });
  }
}

// UPDATE COMMENT
// Update a comment (only by the author)
export async function updateComment(req, res) {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  try {
    const existingComment = await prisma.comment.findUnique({ where: { id } });
    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Only allow the author to edit
    if (existingComment.authorId !== userId) {
      return res.status(403).json({ error: 'Not authorized to edit this comment' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
      include: { author: true },
    });

    return res.json({ updatedComment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update comment' });
  }
}

// DELETE COMMENT
// Delete a comment (author or admin)
export async function deleteComment(req, res) {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Author or admin can delete
    if (existingComment.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await prisma.comment.delete({ where: { id } });

    return res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete comment' });
  }
}
